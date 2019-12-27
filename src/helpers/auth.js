const jwt = require('jsonwebtoken')
const MiscHelper = require('../helpers/helpers')

module.exports = {
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

        next()
      })
    } else {
      return MiscHelper.response(res, 'Need Access token!', 403)
    }
  }
}
