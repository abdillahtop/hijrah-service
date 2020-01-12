const userModels = require('../models/users')
const MiscHelper = require('../helpers/helpers')
const nodemailer = require('nodemailer')
const uuidv4 = require('uuid/v4')
const domain = require('../configs/global_config/config')
const dateFormat = require('dateformat')
const cloudinary = require('cloudinary')
const jwt = require('jsonwebtoken')
const validate = require('validate.js')
const config = require('../configs/global_config/config')

module.exports = {
  getIndex: (req, res) => {
    return res.json({
      code: 200,
      message: 'Server Running well, ready to use'
    })
  },

  getUsers: (req, res) => {
    userModels.getUsers((err, result) => {
      if (err) console.log(err)

      MiscHelper.response(res, result, 200)
    })
  },

  userDetail: (req, res) => {
    userModels
      .userDetail(req.user_id)
      .then(resultUser => {
        const result = resultUser[0]
        if (resultUser[0] === undefined) {
          MiscHelper.response(res, 'user not found', 401)
        } else {
          MiscHelper.response(res, result, 200)
        }
      })
      .catch(error => {
        MiscHelper.response(res, 'Bad request', 404)
        console.log(error)
      })
  },

  register: async (req, res) => {
    const checkEmail = await userModels.getByEmail(req.body.email)
    if (checkEmail[0] === undefined) {
      const salt = MiscHelper.generateSalt(64)
      const passwordHash = MiscHelper.setPassword(req.body.password, salt)

      const data = {
        user_id: uuidv4(),
        email: req.body.email,
        name: req.body.name,
        password: passwordHash.passwordHash,
        salt: passwordHash.salt,
        profile_url: config.defaultProfile,
        activation: 0,
        created_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        updated_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        role_id: 1,
        verified: false,
        isOrganized: false
      }

      userModels
        .register(data)
        .then(async () => {
          await MiscHelper.response(res, 'Data has been saved', 200)
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'helpdesk.hijrahapp@gmail.com',
              pass: 'hijrahapp1234'
            }
          })
          const body = await `${domain.baseUrl}/api/v1/user/activation?email=${req.body.email}`
          const mailOptions = {
            from: 'helpdesk.hijrahapp@gmail.com',
            to: req.body.email,
            subject: 'Verify Akun',
            html:
              'Hello, ' +
              req.body.name +
              '<br> Please Click on the link to verify your email.<br><a href=' +
              body +
              '>Click here to verify</a>'
          }
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log('Sukses Send email')
            }
          })
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      MiscHelper.response(res, 'Email has been used', 403)
    }
  },

  login: async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const checkEmail = await userModels.getByEmail(req.body.email)

    if (checkEmail[0] === undefined) {
      MiscHelper.response(res, 'User not found', 401)
    } else {
      userModels
        .getByEmail(email)
        .then(result => {
          const dataUser = result[0]
          const usePassword = MiscHelper.setPassword(password, dataUser.salt)
            .passwordHash
          if (usePassword === dataUser.password) {
            dataUser.token = jwt.sign(
              {
                user_id: dataUser.user_id
              },
              process.env.SECRET_KEY,
              { expiresIn: '1000h' }
            )

            delete dataUser.salt
            delete dataUser.password
            // delete dataUser.token
            userModels.updateToken(dataUser.token, dataUser.email)
            return MiscHelper.response(res, dataUser.token, 200)
          } else {
            return MiscHelper.response(res, null, 403, 'Wrong password!')
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },

  activationUser: (req, res) => {
    const email = req.query.email
    userModels
      .getByEmail(email)
      .then(result => {
        if (validate.isEmpty(email)) {
          MiscHelper.response(res, 'need token!', 403)
        } else {
          const dataUser = result[0]
          if (dataUser.activation === '1') {
            MiscHelper.response(res, 'User already actived', 202)
          } else {
            userModels
              .activationUser(email)
              .then(() => {
                MiscHelper.response(res, 'User has been actived', 200)
              })
              .catch(() => {
                MiscHelper.response(res, 'Bad Request', 404)
              })
          }
        }
      })
      .catch(error => {
        console.log('inih' + error)
        MiscHelper.response(res, 'User not found', 401)
      })
  },

  updateProfile: async (req, res) => {
    const checkUser = await userModels.userDetail(req.user_id)

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
    if (checkUser[0] === undefined) {
      MiscHelper.response(res, 'User not found', 401)
    } else {
      const data = {
        name: req.body.name,
        profile_url: await geturl(),
        phone_number: req.body.phoneNumber,
        gender: req.body.gender,
        birth_date: req.body.birthDate
      }
      userModels.updateProfile(data, req.user_id)
        .then(() => {
          MiscHelper.response(res, 'Data has been updated', 200)
        })
        .catch(() => {
          MiscHelper.response(res, 'Bad request', 404)
        })
    }
  },

  forgetPassword: async (req, res) => {
    const checkEmail = await userModels.getByEmail(req.body.email)
    if (checkEmail[0] === undefined) {
      MiscHelper.response(res, 'User not found', 401)
      console.log('User not found')
    } else {
      const salt = MiscHelper.generateSalt(64)
      const passwordHash = MiscHelper.setPassword(req.body.password, salt)

      const data = {
        password: passwordHash.passwordHash,
        salt: passwordHash.salt
      }

      userModels.forgetPassword(data, req.body.email)
        .then(() => {
          MiscHelper.response(res, 'Password change successfull', 200)
          console.log('Password change successfull')
        })
        .catch((err) => {
          MiscHelper.response(res, 'Bad Request', 404)
          console.log('Error : ' + err)
        })
    }
  }
}
