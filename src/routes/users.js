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
  .get('/userDetail', Auth.accesstoken, UserController.userDetail)
  .get('/verify', UserController.validateCode)
  .post('/activation', Auth.accesstoken, UserController.activationUser)
  .post('/register', UserController.register)
  .post('/register-admin', Auth.authInfo, UserController.registerAdmin)
  .post('/register-gmail', UserController.registerbyGmail)
  .post('/forget-password', UserController.forgetPassword)
  .post('/send-code', UserController.sendCode)
  .post('/login', UserController.login)
  .patch('/update-profile', upload.single('image'), Auth.accesstoken, UserController.updateProfile)
module.exports = Route
