const express = require('express')
const Route = express.Router()
const multer = require('multer')
const upload = multer()
const sending = require('../helpers/nodemailer')

const UstadzController = require('../controllers/ustadz')
const Auth = require('../helpers/auth')

Route
    .get('/', UstadzController.getIndex)
    .post('/add-ustadz', Auth.accesstoken, UstadzController.addUstadz)
    .delete('/:ustadzId', Auth.accesstoken, UstadzController.deleteUstadz)
module.exports = Route
