const versionModel = require('../models/version')
const userModels = require('../models/users')
const MiscHelper = require('../helpers/helpers')

module.exports = {
  getIndex: (req, res) => {
    return res.json({
      code: 200,
      message: 'Server Running well, ready to use'
    })
  },

  getVersion: (req, res) => {
    versionModel.getVersion((err, result) => {
      if (err) console.log(err)

      MiscHelper.response(res, result, 200)
    })
  },

  updateVersion: async (req, res) => {
    const checkUser = await userModels.userDetail(req.user_id)

    if (checkUser[0] === undefined) {
      MiscHelper.response(res, 'User not found', 204)
    } else {
      if (checkUser[0].role_id === 4) {
        const data = {
          version: req.body.versionAndroid,
          dateUpdate: new Date()
        }
        versionModel.updateVersion(data)
          .then(() => {
            MiscHelper.response(res, 'Update Version Success', 200)
          })
          .catch(() => {
            MiscHelper.response(res, 'Bad request', 400)
          })
      }
    }
  }

}
