const userModels = require('../models/users')
const MiscHelper = require('../helpers/helpers')

module.exports = {
  getIndex: (req, res) => {
    return res.json({ message: 'Hello' })
  },

  getUsers: (req, res) => {
    userModels.getUsers((err, result) => {
      if (err) console.log(err)

      res.json(result)
      // return MiscHelper.response(res, result, 200)
    })
  },

  userDetail: (req, res) => {
    const userid = req.params.userid

    userModels.userDetail(userid, (err, resultUser) => {
      if (err) console.log(err)
      const result = resultUser[0]
      
      return MiscHelper.response(res, result, 200)
    })
  }
}
