const express = require('express')
const Route = express.Router()

const UserController = require('../controllers/users')
const Auth = require('../helpers/auth')

Route
  .all('/*', Auth.authInfo)
  .get('/', Auth.accesstoken, UserController.getUsers)
  .get('/:userid', UserController.userDetail)
  .post('/register', UserController.register)
  .post('/login', UserController.login)

module.exports = Route
