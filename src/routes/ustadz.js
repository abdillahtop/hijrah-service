const express = require('express')
const multer = require('multer')
const Route = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })
const UstadzController = require('../controllers/ustadz')
const Auth = require('../helpers/auth')

Route
  .all('/', Auth.authInfoGlobal)
  .get('/', UstadzController.getIndex)
  .get('/list-ustadz', Auth.authInfoGlobal, UstadzController.getUstadzByKajian)
  .post('/add-ustadz', upload.single('image'), Auth.accesstoken, UstadzController.addUstadz)
  .delete('/', Auth.accesstoken, UstadzController.deleteUstadz)
module.exports = Route
