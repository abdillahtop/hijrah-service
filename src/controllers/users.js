const userModels = require('../models/users')
const MiscHelper = require('../helpers/helpers')

const jwt = require('jsonwebtoken')

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

  register: (req, res) => {
    const salt = MiscHelper.generateSalt(18)
    const passwordHash = MiscHelper.setPassword(req.body.password, salt)

    const data = {
      email: req.body.email,
      fullname: req.body.fullname,
      password: passwordHash.passwordHash,
      salt: passwordHash.salt,
      token: 'Test',
      status: 1,
      created_at: new Date(),
      updated_at: new Date()
    }

    userModels.register(data)
      .then((resultRegister) => {
        MiscHelper.response(res, resultRegister, 200)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  login: (req, res) => {
    const email = req.body.email
    const password = req.body.password

    userModels.getByEmail(email)
      .then((result) => {
        const dataUser = result[0]
        const usePassword = MiscHelper.setPassword(password, dataUser.salt).passwordHash

        if (usePassword === dataUser.password) {
          dataUser.token = jwt.sign({
            userid: dataUser.userid
          }, process.env.SECRET_KEY, { expiresIn: '1h' })

          delete dataUser.salt
          delete dataUser.password

          return MiscHelper.response(res, dataUser, 200)
        } else {
          return MiscHelper.response(res, null, 403, 'Wrong password!')
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
