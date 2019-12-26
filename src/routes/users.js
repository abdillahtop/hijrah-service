const express = require('express')
const Route = express.Router()
const multer = require('multer')
const upload = multer()
const sending = require('../helpers/nodemailer')

const UserController = require('../controllers/users')
const Auth = require('../helpers/auth')

Route
  .get('/', UserController.getIndex)
  .get('/:userid', UserController.userDetail)
  .post('/activation', UserController.activationUser)
  .post('/register', UserController.register, sending)
  .post('/login', UserController.login)
  .post('/cloudinary', upload.single('image'), UserController.cloudinary)
module.exports = Route
