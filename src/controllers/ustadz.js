const ustadzModels = require('../models/ustadz')
const kajianModels = require('../models/kajian')
const MiscHelper = require('../helpers/helpers')
const uuidv4 = require('uuid/v4')
const cloudinary = require('cloudinary')

module.exports = {
  getIndex: (req, res) => {
    return res.json({
      code: 200,
      message: 'Server Running well, ready to use'
    })
  },

  addUstadz: async (req, res) => {
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
          MiscHelper.response(res, 'Cloud Server disable', 404)
        } else {
          dataCloudinary = result.url
        }
      })

      return dataCloudinary
    }
    const checkKajian = await kajianModels.checkKajian(req.body.kajianId)
    if (checkKajian[0] === undefined) {
      MiscHelper.response(res, 'Kajian not found', 401)
    } else {
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
          MiscHelper.response(res, 'Bad request', 404)
          console.log('error ' + error)
        })
    }
  },

  deleteUstadz: (req, res) => {
    const ustadzId = req.params.ustadzId
    ustadzModels
      .deleteUstadz(ustadzId)
      .then(() => {
        MiscHelper.response(res, 'Ustadz has been delete', 200)
      })
      .catch(error => {
        MiscHelper.response(res, 'Bad request!', 404)
        console.log('Err ' + error)
      })
  },

  getUstadzByKajian: (req, res) => {
    const kajianId = req.query.kajianId
    ustadzModels.getUstadzByKajian(kajianId).then(result => {
      if (result === '') {
        MiscHelper.response(res, 'Not found ustadz in this kajian', 401)
      } else {
        MiscHelper.response(res, result, 200)
      }
    })
  }
}
