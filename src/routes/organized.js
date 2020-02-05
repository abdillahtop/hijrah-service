const express = require('express')
const Route = express.Router()
const multer = require('multer')
const sending = require('../helpers/nodemailer')
const OrganizedController = require('../controllers/organized')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

const Auth = require('../helpers/auth')

Route
  .get('/', OrganizedController.getIndex)
  .get('/organizedDetail', Auth.authInfoGlobal, Auth.accesstoken, OrganizedController.organizedDetail)
  .get('/list-organized', Auth.accesstoken, OrganizedController.listOrganized)
  .post('/register', upload.single('profile_url'), Auth.accesstoken, OrganizedController.register)
  .post('/activation-organized', Auth.accesstoken, OrganizedController.activeOrganized, sending)
  .patch('/update-organized', upload.single('profile_url'), Auth.accesstoken, OrganizedController.updateOrganized)
  .delete('/:organizedId', Auth.accesstoken, OrganizedController.deleteOrganized)

module.exports = Route
