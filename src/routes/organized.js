const express = require('express')
const Route = express.Router()
const multer = require('multer')
const upload = multer()
const sending = require('../helpers/nodemailer')

const OrganizedController = require('../controllers/organized')
const Auth = require('../helpers/auth')

Route
    .get('/', OrganizedController.getIndex)
    .post('/register', Auth.accesstoken, OrganizedController.register)

module.exports = Route
