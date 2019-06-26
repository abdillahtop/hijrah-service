const express = require('express')
const Route = express.Router()

const UserController = require('../controllers/users')

Route
  .get('/', UserController.getUsers)
  .get('/:userid', UserController.userDetail)
  .patch('/:userid', UserController.updateUser)

module.exports = Route
