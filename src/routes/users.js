const express = require('express')
const Route = express.Router()

const UserController = require('../controllers/users')

Route
  .all('/')
  .get('/', UserController.getUsers)
  .get('/:userid', UserController.userDetail)


module.exports = Route
