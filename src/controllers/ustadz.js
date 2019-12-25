const ustadzModels = require('../models/ustadz');
const kajianModels = require('../models/kajian');
const MiscHelper = require('../helpers/helpers');
const uuidv4 = require('uuid/v4');
const dateFormat = require('dateformat');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2
const validate = require('validate.js')

module.exports = {
  getIndex: (req, res) => {
    return res.json({ code: 200, message: 'Server Running well, ready to use' })
  },

  addUstadz: async (req, res) => {
    const checkKajian = await kajianModels.checkKajian(req.body.kajianId)
    console.log("cekk "+ JSON.stringify(checkKajian))
    if(checkKajian[0] == undefined) {
        MiscHelper.response(res, 'Kajian not found', 404)
    } else {
        const data = {
            kajian_id: checkKajian[0].kajian_id,
            ustadz_id: uuidv4(),
            ustadz_name: req.body.nameUstadz,
            image: validate.isEmpty(req.body.image) ? 'default' : req.body.image
        }
        ustadzModels.addUstadz(data)
            .then(() => {
                MiscHelper.response(res, 'Add ustadz success!', 200)
            })
            .catch((error) => {
                MiscHelper.response(res, 'Bad request', 404)
                console.log("error "+ error)
            })
    }
  },

  deleteUstadz: (req, res) => {
      const ustadzId = req.params.ustadzId
      ustadzModels.deleteUstadz(ustadzId)
      .then(() => {
          MiscHelper.response(res, 'Ustadz has been delete', 200)
      })
      .catch((error) => {
          MiscHelper.response(res, 'Bad request!', 404)
          console.log('Err '+error)
      })
  }
  
}
