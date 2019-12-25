const express = require('express')
const Route = express.Router()
const multer = require('multer')
const upload = multer()
const sending = require('../helpers/nodemailer')

const KajianController = require('../controllers/kajian')
const Auth = require('../helpers/auth')

Route
    .get('/', KajianController.getIndex)
    .get('/member-kajian', Auth.accesstoken, KajianController.getMemberKajianAll)
    .get('/kajian-all', KajianController.getAllKajian)
    .get('/kajian-cat', KajianController.getAllKajianByCategory)
    .get('/kajian-user', Auth.accesstoken, KajianController.getKajianbyUser)
    .get('/find-kajian', Auth.accesstoken, KajianController.findKajian)
    .post('/add-kajian', Auth.accesstoken, KajianController.addKajian)
    .post('/add-member-kajian', Auth.accesstoken, KajianController.addMemberKajian)

module.exports = Route
