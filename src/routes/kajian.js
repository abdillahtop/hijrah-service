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
  .get('/kajian-populer', KajianController.getAllKajianPopuler)
  .get('/kajian-user/:active', Auth.accesstoken, KajianController.getKajianbyUser)
  .get('/kajian-organized', Auth.accesstoken, KajianController.getKajianbyOrganized)
  .get('/find-kajian', KajianController.findKajian)
  .get('/detail-kajian/:kajianId', Auth.accesstokenNoMandatory, KajianController.detailKajian)
  .post('/add-kajian', upload.single('image'), Auth.accesstoken, KajianController.addKajian)
  .post('/add-member-kajian', Auth.accesstoken, KajianController.addMemberKajian)
  .patch('/update-kajian/:kajianId', upload.single('image'), Auth.accesstoken, KajianController.editKajian)
  .delete('/unjoin-kajian', Auth.accesstoken, KajianController.unjoinKajian)
  .delete('/:kajianId', Auth.accesstoken, KajianController.deleteKajian)
  .delete('/kajian-user/:kajianId', Auth.accesstoken, KajianController.deleteKajianUser)

module.exports = Route
