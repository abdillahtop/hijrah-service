const express = require('express')
const Route = express.Router()
const multer = require('multer')
const KajianController = require('../controllers/kajian')
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
  .get('/', KajianController.getIndex)
  .get('/member-kajian', Auth.accesstoken, KajianController.getMemberKajianAll)
  .get('/kajian-all', KajianController.getAllKajian)
  .get('/kajian-cat', KajianController.getAllKajianByCategory)
  .get('/kajian-nearby', KajianController.getAllKajianNearby)
  .get('/kajian-user', Auth.accesstoken, KajianController.getKajianbyUser)
  .get('/find-kajian', KajianController.findKajian)
  .post('/add-kajian', upload.single('image'), Auth.accesstoken, KajianController.addKajian)
  .post('/add-member-kajian', Auth.accesstoken, KajianController.addMemberKajian)
  .delete('/unjoin-kajian', Auth.accesstoken, KajianController.unjoinKajian)
  .delete('/', Auth.accesstoken, KajianController.deleteKajian)

module.exports = Route
