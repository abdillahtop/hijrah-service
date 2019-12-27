const express = require('express')
const Route = express.Router()
const multer = require('multer')
const sending = require('../helpers/nodemailer')
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
  .get('/:userid', UserController.userDetail)
  .post('/activation', UserController.activationUser)
  .post('/register', UserController.register, sending)
  .post('/login', UserController.login)
  // .post('/cloudinary', upload.single('image'), UserController.cloudinary)
  .patch('/update-profile', upload.single('image'), Auth.accesstoken, UserController.updateProfile)
module.exports = Route
