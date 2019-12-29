const express = require('express')
const Route = express.Router()
// const multer = require('multer')
// const upload = multer()
// const sending = require('../helpers/nodemailer')

const OrganizedController = require('../controllers/organized')
const Auth = require('../helpers/auth')

Route
  .get('/', OrganizedController.getIndex)
  .get('/organizedDetail', Auth.accesstoken, OrganizedController.organizedDetail)
  .post('/register', Auth.accesstoken, OrganizedController.register)
  .post('/activation-organized', Auth.accesstoken, OrganizedController.activeOrganized)
  .delete('/:organizedId', Auth.accesstoken, OrganizedController.deleteOrganized)

module.exports = Route
