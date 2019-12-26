const express = require('express')
const Route = express.Router()
const multer = require('multer')
const upload = multer()

const UstadzController = require('../controllers/ustadz')
const Auth = require('../helpers/auth')

Route
    .get('/', UstadzController.getIndex)
    .get('/list-ustadz', UstadzController.getUstadzByKajian)
    .post('/add-ustadz', Auth.accesstoken, UstadzController.addUstadz)
    .delete('/:ustadzId', Auth.accesstoken, UstadzController.deleteUstadz)
module.exports = Route
