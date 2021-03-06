const ustadzModels = require('../models/ustadz')
const kajianModels = require('../models/kajian')
const MiscHelper = require('../helpers/helpers')
const uuidv4 = require('uuid/v4')
const cloudinary = require('cloudinary')
const config = require('../configs/global_config/config')

module.exports = {
  getIndex: (req, res) => {
    return res.json({
      code: 200,
      message: 'Server Running well, ready to use'
    })
  },

  addUstadz: async (req, res) => {
    const checkKajian = await kajianModels.checkKajian(req.body.kajianId)
    if (checkKajian[0] === undefined) {
      MiscHelper.response(res, 'Kajian not found', 204)
    } else {
      if (req.file === undefined) {
        const data = {
          kajian_id: checkKajian[0].kajian_id,
          ustadz_id: uuidv4(),
          ustadz_name: req.body.nameUstadz,
          image: config.defaultProfile
        }
        ustadzModels
          .addUstadz(data, req.body.kajianId)
          .then(() => {
            MiscHelper.response(res, 'Add ustadz success!', 200)
          })
          .catch(error => {
            MiscHelper.response(res, 'Bad request', 400)
            console.log('error ' + error)
          })
      } else {
        const path = await req.file.path
        const geturl = async (req) => {
          cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_CLOUD_KEY,
            api_secret: process.env.API_CLOUD_SECRET
          })

          let dataCloudinary
          await cloudinary.uploader.upload(path, (result) => {
            if (result.error) {
              MiscHelper.response(res, 'Cloud Server disable', 500)
            } else {
              dataCloudinary = result.url
            }
          })

          return dataCloudinary
        }
        const data = {
          kajian_id: checkKajian[0].kajian_id,
          ustadz_id: uuidv4(),
          ustadz_name: req.body.nameUstadz,
          image: await geturl()
        }
        ustadzModels
          .addUstadz(data, req.body.kajianId)
          .then(() => {
            MiscHelper.response(res, 'Add ustadz success!', 200)
          })
          .catch(error => {
            MiscHelper.response(res, 'Bad request', 400)
            console.log('error ' + error)
          })
      }
    }
  },

  deleteUstadz: async (req, res) => {
    const ustadzId = req.query.ustadzId
    const kajianId = req.query.kajianId

    const ustadzOne = await ustadzModels.getUstadzOne(kajianId, ustadzId)
    const checkKajian = await kajianModels.checkKajian(kajianId)
    if (checkKajian[0] === undefined) {
      MiscHelper.response(res, 'Kajian not found', 202)
    } else if (ustadzOne[0] === undefined) {
      MiscHelper.response(res, 'Ustadz not found', 202)
    } else {
      ustadzModels
        .deleteUstadz(ustadzId, kajianId)
        .then(() => {
          MiscHelper.response(res, 'Ustadz has been delete', 200)
        })
        .catch(error => {
          MiscHelper.response(res, 'Bad request!', 400)
          console.log('Err ' + error)
        })
    }
  },

  getUstadzByKajian: (req, res) => {
    const kajianId = req.query.kajianId
    ustadzModels.getUstadzByKajian(kajianId).then(result => {
      if (result === '') {
        MiscHelper.response(res, 'Not found ustadz in this kajian', 204)
      } else {
        MiscHelper.response(res, result, 200)
      }
    })
  }
}
