const express = require('express')
const Route = express.Router()
// const multer = require('multer')
// const upload = multer()
const sending = require('../helpers/nodemailer')

const OrganizedController = require('../controllers/organized')
const Auth = require('../helpers/auth')

Route
  .get('/', OrganizedController.getIndex)
  .get('/organizedDetail', Auth.accesstoken, OrganizedController.organizedDetail)
  .get('/list-organized', Auth.accesstoken, OrganizedController.listOrganized)
  .post('/register', Auth.accesstoken, OrganizedController.register)
  .post('/activation-organized', Auth.accesstoken, OrganizedController.activeOrganized, sending)
  .patch('/update-organized', Auth.accesstoken, OrganizedController.updateOrganized)
  .delete('/:organizedId', Auth.accesstoken, OrganizedController.deleteOrganized)

module.exports = Route
