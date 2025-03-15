const dayjs = require('dayjs')
const uniId = require('uni-id-common')
const openBridge = require('uni-open-bridge-common')

module.exports = {
  async _before() {
    this.clientInfo = this.getClientInfo()
    this.uniId = uniId.createInstance({
      clientInfo: this.clientInfo,
    })
    this.auth = await this.uniId.checkToken(this.getUniIdToken())
    this.db = uniCloud.databaseForJQL({
      clientInfo: this.clientInfo,
    })
    this.db.setUser({
      uid: this.auth.uid,
      role: ['admin'],
    })
  },

  async create(uid, products, note) {
    const staff = await this.db
      .collection('uni-id-users')
      .doc(this.auth.uid)
      .field('nickname, mobile')
      .get({ getOne: true })
      .then((res) => res.data)
    if (staff == null) {
      return {
        errCode: 400,
        errMsg: '未找到该员工',
      }
    }

    const shop = await this.db
      .collection('shop')
      .where(`staff == '${staff.mobile}'`)
      .field('name, mobile')
      .get({ getOne: true })
      .then((res) => res.data)
    if (shop == null) {
      return {
        errCode: 400,
        errMsg: '未找到该门店',
      }
    }

    if (products.length === 0) {
      return {
        errCode: 400,
        errMsg: '没有添加产品',
      }
    }
    const price = products.reduce((total, current) => {
      return total + current.price
    }, 0)

    const balance = await this.db
      .collection('uni-id-users')
      .doc(uid)
      .field('balance')
      .get({ getOne: true })
      .then((res) => (res.data && res.data.balance) || 0)
    if (balance < price) {
      return {
        errCode: 400,
        errMsg: '余额不足',
      }
    }

    const db = uniCloud.database()
    await db
      .collection('uni-id-users')
      .doc(uid)
      .update({
        balance: db.command.inc(-price),
        score: db.command.inc(price / 100),
      })

    const res = await this.db.collection('order').add({
      uid,
      staff,
      shop,
      note,
      products,
      price,
      balance: balance - price,
    })
    // 发送通知
    await this.db
      .collection('uni-id-users')
      .doc(uid)
      .field('wx_openid.mp as openid')
      .get({ getOne: true })
      .then(async (res) => {
        const openid = res.data.openid
        const accessToken = (
          await openBridge.getAccessToken({
            dcloudAppid: '__UNI__AFBD712',
            platform: 'weixin-mp',
            openid,
          })
        ).access_token
        await uniCloud.httpclient.request(
          `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`,
          {
            method: 'POST',
            contentType: 'json',
            dataType: 'json',
            data: {
              touser: openid,
              template_id: 'NOxtTxW9OE0XcL1yHThJeqU7W8-VSmWB7FS-8sZ0By8',
              data: {
                time11: {
                  value: dayjs(Date.now() + 8 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss'),
                },
                amount10: {
                  value: `¥${price / 100}`,
                },
                amount27: {
                  value: `¥${(balance - price) / 100}`,
                },
                name12: {
                  value: shop.name,
                },
                phone_number14: {
                  value: shop.mobile,
                },
              },
              page: 'pages/order/index',
            },
          },
        )
      })
    return res
  },

  async revoke(id) {
    const doc = this.db.collection('order').doc(id)
    const order = await doc.get({ getOne: true }).then((res) => res.data)
    await doc.remove()
    const db = uniCloud.database()
    await db
      .collection('uni-id-users')
      .doc(order.uid)
      .update({
        balance: db.command.inc(order.price),
        score: db.command.inc(-order.price / 100),
      })
  },

  async calc([startTime, endTime]) {
    let orders = []
    const get = async () => {
      return await this.db
        .collection('order')
        .where(`${startTime} <= createTime && createTime < ${endTime}`)
        .skip(orders.length)
        .limit(500)
        .get({
          getCount: true,
        })
        .then((res) => {
          orders = orders.concat(res.data)
          if (orders.length < res.count) {
            return get()
          }
        })
    }
    await get()
    return orders.reduce((res, cur) => {
      let item = res.find((item) => item.staff._id === cur.staff._id)
      if (item == null) {
        item = {
          staff: cur.staff,
          products: [],
        }
        res.push(item)
      }
      cur.products.forEach((x) => {
        const map = {
          packet: '泡',
          box: '盒',
          catty: '斤',
        }
        const product = {
          _id: x._id,
          name: `${x.origin.name}(${map[x.type]})`,
          price: x.origin[`${x.type}Price`],
          count: x.count,
        }
        const c = item.products.find((c) => ['_id', 'name', 'price'].every((key) => c[key] === product[key]))
        if (c == null) {
          item.products.push(product)
        } else {
          c.count += product.count
        }
      })
      return res
    }, [])
  },
}
