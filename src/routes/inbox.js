const express = require('express')
const Route = express.Router()
const multer = require('multer')
const inboxController = require('../controllers/inbox')
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
  .get('/', inboxController.getIndex)
  .get('/inbox-user', Auth.accesstoken, inboxController.getInboxbyUser)
  .get('/check-inbox', Auth.accesstoken, inboxController.checkInbox)
  .post('/send-inbox-admin', upload.single('image'), Auth.accesstoken, inboxController.sendInboxbyAdmin)
module.exports = Route
