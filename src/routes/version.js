const express = require('express')
const Route = express.Router()
const versionCOntroller = require('../controllers/version')

const Auth = require('../helpers/auth')

Route
  .get('/', versionCOntroller.getVersion)
  .post('/add-ustadz', Auth.accesstoken, versionCOntroller.updateVersion)
module.exports = Route
