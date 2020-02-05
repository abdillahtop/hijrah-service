const express = require('express')
const Route = express.Router()
const multer = require('multer')
// const sending = require('../helpers/nodemailer')
const UserController = require('../controllers/users')
const Auth = require('../helpers/auth')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

Route
  .get('/', UserController.getIndex)
  .get('/userDetail', UserController.userDetail)
  .get('/verify', Auth.authInfoGlobal, UserController.validateCode)
  .post('/activation', UserController.activationUser)
  .post('/change-password', UserController.changePassword)
  .post('/register', Auth.authInfoGlobal, UserController.register)
  .post('/register-admin', Auth.authInfo, UserController.registerAdmin)
  .post('/register-gmail', Auth.authGmail, UserController.registerbyGmail)
  .post('/forget-password', Auth.authCode, UserController.forgetPassword)
  .post('/send-code', Auth.authInfoGlobal, UserController.sendCode)
  .post('/login', Auth.authInfoGlobal, UserController.login)
  .patch('/update-profile', upload.single('image'), UserController.updateProfile)
module.exports = Route
