const uniId = require('uni-id-common')

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

  async getUserInfo(data) {
    const { uid, mobile } = data
    let query = ''
    if (uid) {
      query = `_id == '${uid}'`
    } else if (mobile) {
      query = `mobile == '${mobile}'`
    } else {
      return {
        errCode: 400,
        errMsg: '未找到该会员',
      }
    }
    const res = await this.db
      .collection('uni-id-users')
      .where(query)
      .field('nickname, avatar, mobile, balance, score')
      .get({ getOne: true })
      .then((res) => res.data)
    if (res == null) {
      return {
        errCode: 400,
        errMsg: '未找到该会员',
      }
    } else {
      return res
    }
  },

  async updateUserInfo(data) {
    const { uid, mobile, nickname } = data
    let query = ''
    if (uid) {
      query = `_id == '${uid}'`
    } else if (mobile) {
      query = `mobile == '${mobile}'`
    } else {
      return {
        errCode: 400,
        errMsg: '未找到该会员',
      }
    }
    return await this.db.collection('uni-id-users').where(query).update({ nickname })
  },

  async delEmptyUser() {
    this.db.collection('uni-id-users').doc(this.auth.uid).remove()
  },
}
