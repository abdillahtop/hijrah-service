const jwt = require('jsonwebtoken')
const MiscHelper = require('../helpers/helpers')
const userModel = require('../models/users')

const allowing = process.env.REQUEST_HEADERS_GLOBAL
const allowedAccess = process.env.REQUEST_HEADERS
const allowedAccessGmail = process.env.REQUEST_GMAIL_HEADERS

module.exports = {
  authInfo: (req, res, next) => {
    const headerAuth = req.headers.authorization
    const headerSecret = req.headers['x-access-token']

    if (headerAuth !== allowedAccess) {
      return MiscHelper.response(res, null, 401, 'Unauthorized, Need Authentication!')
    } else if (typeof headerSecret === 'undefined') {
      next()
    } else {
      const bearerToken = headerSecret.split(' ')
      const token = bearerToken[1]
      req.token = token
      console.log('Token stored!')
      next()
    }
  },

  authInfoGlobal: (req, res, next) => {
    const headerAuth = req.headers.authorization
    const headerSecret = req.headers['x-access-token']

    if (headerAuth !== allowing) {
      return MiscHelper.response(res, 'You didt have to accesss this API contact us in apphijrah.id', 401)
    } else if (typeof headerSecret === 'undefined') {
      next()
    } else {
      const bearerToken = headerSecret.split(' ')
      const token = bearerToken[1]
      req.token = token
      console.log('Token stored!')
      next()
    }
  },

  authGmail: (req, res, next) => {
    const headerAuth = req.headers.authorization
    const headerSecret = req.headers['x-access-token']

    if (headerAuth !== allowedAccessGmail) {
      return MiscHelper.response(res, null, 401, 'Unauthorized, Need Authentication!')
    } else if (typeof headerSecret === 'undefined') {
      console.log('Authentication Valid!')
      next()
    } else {
      const bearerToken = headerSecret.split(' ')
      const token = bearerToken[1]
      req.token = token
      console.log('Token stored!')
      next()
    }
  },

  authCode: async (req, res, next) => {
    const userDetail = userModel.getByEmail(req.body.email)
    const headerAuth = req.headers.authorization
    const headerSecret = req.headers['x-access-token']
    const hello = await userDetail
    if (headerAuth !== hello[0].activation_code) {
      return MiscHelper.response(res, null, 401, 'Unauthorized, Need Authentication!')
    } else if (typeof headerSecret === 'undefined') {
      next()
    } else {
      const bearerToken = headerSecret.split(' ')
      const token = bearerToken[1]
      req.token = token
      console.log('Token stored!')
      next()
    }
  },

  accesstoken: (req, res, next) => {
    const header = req.headers.authorization
    const secretKey = process.env.SECRET_KEY

    if (typeof header !== 'undefined') {
      const bearer = header.split(' ')
      const token = bearer[1]

      jwt.verify(token, secretKey, (err, decoded) => {
        if (err && err.name === 'TokenExpiredError') return MiscHelper.response(res, null, 401, 'Token expired')

        if (err && err.name === 'JsonWebTokenError') return MiscHelper.response(res, null, 401, 'Invalid Token')

        req.user_id = decoded.user_id

        req.roleId = decoded.role_id

        next()
      })
    } else {
      return MiscHelper.response(res, 'Need Access token!', 403)
    }
  },

  accesstokenNoMandatory: (req, res, next) => {
    const header = req.headers.authorization
    const secretKey = process.env.SECRET_KEY

    if (typeof header !== 'undefined') {
      const bearer = header.split(' ')
      const token = bearer[1]

      jwt.verify(token, secretKey, (err, decoded) => {
        if (err && err.name === 'TokenExpiredError') return MiscHelper.response(res, null, 401, 'Token expired')

        if (err && err.name === 'JsonWebTokenError') return MiscHelper.response(res, null, 401, 'Invalid Token')

        req.user_id = decoded.user_id

        req.roleId = decoded.role_id

        next()
      })
    } else {
      next()
    }
  }
}
