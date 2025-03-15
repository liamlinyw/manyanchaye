const dayjs = require('dayjs')
const path = require('path')
const uniId = require('uni-id-common')
const uniPay = require('uni-pay')
const openBridge = require('uni-open-bridge-common')

async function rechargeSuccessFun(res) {
  const db = uniCloud.database()
  const transaction = await db.startTransaction()
  const doc = transaction.collection('recharge').doc(res.outTradeNo)
  const recharge = await doc.get().then((res) => res.data)
  if (recharge.payTime == null && res.totalFee === recharge.card.amount) {
    await doc.update({
      payTime: Date.now(),
    })
    await transaction
      .collection('uni-id-users')
      .doc(recharge.uid)
      .update({
        balance: db.command.inc(recharge.card.amount + recharge.card.give),
      })
  }
  await transaction.commit()

  // 发送通知
  await this.db
    .collection('uni-id-users')
    .doc(recharge.uid)
    .field('mobile, balance')
    .get({ getOne: true })
    .then(async ({ data: user }) => {
      const openid = res.openid
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
            template_id: '-NYdGqaBc4sFVBI2YbDXtTrI6sBeP4ycloZcurKa2z0',
            data: {
              date5: {
                value: dayjs(Date.now() + 8 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss'),
              },
              character_string8: {
                value: user.mobile,
              },
              amount3: {
                value: `¥${recharge.card.amount / 100}`,
              },
              amount7: {
                value: `¥${recharge.card.give / 100}`,
              },
              amount4: {
                value: `¥${user.balance / 100}`,
              },
            },
            page: 'pages/user/index',
          },
        },
      )
    })
}

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
    this.uniPay = uniPay.initWeixinV3({
      appId: 'wx57e9e222fb4d1e82',
      mchId: '1613675357',
      v3Key: '5HvtD0MqZUgHwblHJ4VrNVMes22gNm83',
      appCertPath: path.join(__dirname, 'apiclient_cert.pem'),
      appPrivateKeyPath: path.join(__dirname, 'apiclient_key.pem'),
    })
  },

  async recharge(card, uid, noNeedPay) {
    // const card = await this.db
    //   .collection('card')
    //   .doc(cardId)
    //   .get({ getOne: true })
    //   .then((res) => res.data)
    if (card == null) {
      return {
        errCode: 400,
        errMsg: '未找到充值卡',
      }
    }

    let staff
    if (uid) {
      staff = await this.db
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
    }

    const outTradeNo = await this.db
      .collection('recharge')
      .add({
        uid: uid || this.auth.uid,
        staff,
        card,
      })
      .then((res) => res.id)

    const openid = await this.db
      .collection('uni-id-users')
      .where('_id == $cloudEnv_uid')
      .field('wx_openid.mp as openid')
      .get({ getOne: true })
      .then((res) => res.data.openid)

    if (noNeedPay) {
      await rechargeSuccessFun.call(this, {
        totalFee: card.amount,
        outTradeNo,
        openid,
      })
      return null
    }
    return await this.uniPay.getOrderInfo({
      tradeType: 'JSAPI',
      notifyUrl: 'https://03d901e0-1f60-498a-96ef-287769a65a3c.bspapp.com/payment/notify',
      totalFee: card.amount,
      outTradeNo,
      openid,
      spbillCreateIp: this.clientInfo.clientIP,
      body: '充值钱包余额',
    })
  },

  async notify() {
    const res = await this.uniPay.verifyPaymentNotify(this.getHttpInfo())
    if (res.tradeState === 'SUCCESS') {
      await rechargeSuccessFun.call(this, res)
    }
    return {
      mpserverlessComposedResponse: true,
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        code: 'SUCCESS',
        message: '成功',
      }),
    }
  },

  async revoke(id) {
    const doc = this.db.collection('recharge').doc(id)
    const recharge = await doc.get({ getOne: true }).then((res) => res.data)
    await doc.remove()
    const db = uniCloud.database()
    await db
      .collection('uni-id-users')
      .doc(recharge.uid)
      .update({
        balance: db.command.inc(-(recharge.card.amount + recharge.card.give)),
      })
  },
}
