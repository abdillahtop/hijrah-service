const userModels = require('../models/users')
const MiscHelper = require('../helpers/helpers')

module.exports = {
  getIndex: (req, res) => {
    return res.json({ message: 'Hello' })
  },

  // Using Callback
  getUsers: (req, res) => {
    userModels.getUsers((err, result) => {
      if (err) console.log(err)

      // res.json(result)
      MiscHelper.response(res, result, 200)
    })
  },

  // Using Promise
  userDetail: (req, res) => {
    const userid = req.params.userid

    userModels.userDetail(userid)
      .then((resultUser) => {
        const result = resultUser[0]
        MiscHelper.response(res, result, 200)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  updateUser: async (req, res) => {

  }
}
