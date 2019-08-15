const jwt = require('jsonwebtoken')
const MiscHelper = require('../helpers/helpers')

const allowedAccess = process.env.REQUEST_HEADERS

module.exports = {
  authInfo: (req, res, next) => {
    const headerAuth = req.headers['authorization']
    const headerSecret = req.headers['x-access-token']

    if (headerAuth !== allowedAccess) {
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

  accesstoken: (req, res, next) => {
    const secretKey = process.env.SECRET_KEY
    const accessToken = req.token
    const userToken = req.headers['x-control-user']

    jwt.verify(accessToken, secretKey, (err, decoded) => {
      if (err && err.name === 'TokenExpiredError') return MiscHelper.response(res, null, 401, 'Token expired')

      if (err && err.name === 'JsonWebTokenError') return MiscHelper.response(res, null, 401, 'Invalid Token')

      if (parseInt(userToken) !== parseInt(decoded.userid)) return MiscHelper.response(res, null, 401, 'Invalid User Token')
      console.log('Access Granted!')
      next()
    })
  }
}
