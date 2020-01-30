const userModels = require('../models/users')
const MiscHelper = require('../helpers/helpers')
const nodemailer = require('nodemailer')
const uuidv4 = require('uuid/v4')
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
          MiscHelper.response(res, 'user not found', 204)
        } else {
          MiscHelper.response(res, result, 200)
        }
      })
      .catch(error => {
        MiscHelper.response(res, 'Bad request', 400)
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
        isOrganized: false,
        activation_code: ''
      }

      userModels
        .register(data)
        .then(async () => {
          const result = await userModels.getByEmail(req.body.email)
          const dataUser = result[0]
          const usePassword = MiscHelper.setPassword(req.body.password, dataUser.salt)
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
          }
          userModels.updateToken(dataUser.token, dataUser.email)
          const data = {
            token: dataUser.token,
            activation: dataUser.activation
          }
          return MiscHelper.response(res, data, 200, 'Email inserted')
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      MiscHelper.response(res, 'Email has been used', 401)
    }
  },

  registerAdmin: async (req, res) => {
    const checkEmail = await userModels.getByEmail(req.body.email)

    if (checkEmail[0] === undefined) {
      const salt = MiscHelper.generateSalt(64)
      const passwordHash = MiscHelper.setPassword(req.body.password, salt)

      const data = {
        user_id: uuidv4(),
        email: req.body.email,
        name: 'ADMIN HIJRAH',
        password: passwordHash.passwordHash,
        salt: passwordHash.salt,
        profile_url: config.defaultProfile,
        activation: 1,
        created_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        updated_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        role_id: 4,
        verified: true,
        isOrganized: false,
        activation_code: ''
      }

      userModels
        .register(data)
        .then(async () => {
          const result = await userModels.getByEmail(req.body.email)
          const dataUser = result[0]
          const usePassword = MiscHelper.setPassword(req.body.password, dataUser.salt)
            .passwordHash
          if (usePassword === dataUser.password) {
            dataUser.token = jwt.sign(
              {
                user_id: dataUser.user_id,
                role_id: dataUser.role_id
              },
              process.env.SECRET_KEY,
              { expiresIn: '1000h' }
            )

            delete dataUser.salt
            delete dataUser.password
          }
          userModels.updateToken(dataUser.token, dataUser.email)
          const data = {
            token: dataUser.token,
            activation: dataUser.activation
          }
          return MiscHelper.response(res, data, 200, 'Email inserted')
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      MiscHelper.response(res, 'Email has been used', 401)
    }
  },

  registerbyGmail: async (req, res) => {
    const checkEmail = await userModels.getByEmail(req.body.email)

    if (checkEmail[0] === undefined) {
      const salt = MiscHelper.generateSalt(64)
      const passwordHash = MiscHelper.setPassword('sobatHijrah', salt)

      const data = {
        user_id: uuidv4(),
        email: req.body.email,
        name: req.body.name,
        password: passwordHash.passwordHash,
        salt: passwordHash.salt,
        profile_url: req.body.photoProfile,
        activation: 1,
        created_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        updated_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        role_id: 1,
        verified: false,
        isOrganized: false,
        activation_code: ''
      }

      userModels
        .register(data)
        .then(async () => {
          const result = await userModels.getByEmail(req.body.email)
          const dataUser = result[0]
          const usePassword = MiscHelper.setPassword('sobatHijrah', dataUser.salt)
            .passwordHash
          if (usePassword === dataUser.password) {
            dataUser.token = jwt.sign(
              {
                user_id: dataUser.user_id,
                role_id: dataUser.role_id
              },
              process.env.SECRET_KEY,
              { expiresIn: '1000h' }
            )

            delete dataUser.salt
            delete dataUser.password
          }
          userModels.updateToken(dataUser.token, dataUser.email)
          const data = {
            token: dataUser.token
          }
          return MiscHelper.response(res, data, 200, 'Email inserted')
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      MiscHelper.response(res, 'Email has been used', 401)
    }
  },

  login: async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const checkEmail = await userModels.getByEmail(req.body.email)

    if (checkEmail[0] === undefined) {
      MiscHelper.response(res, 'User not found', 204)
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
                user_id: dataUser.user_id,
                role_id: dataUser.role_id
              },
              process.env.SECRET_KEY,
              { expiresIn: '1000h' }
            )

            delete dataUser.salt
            delete dataUser.password
            // delete dataUser.token
            userModels.updateToken(dataUser.token, dataUser.email)
            const data = {
              token: dataUser.token,
              activation: dataUser.activation
            }
            return MiscHelper.response(res, data, 200)
          } else {
            return MiscHelper.response(res, null, 401, 'Wrong password!')
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },

  activationUser: async (req, res) => {
    const checkUser = await userModels.userDetail(req.user_id)
    const code = req.query.code

    userModels
      .getByEmail(checkUser[0].email)
      .then(result => {
        if (validate.isEmpty(checkUser[0].email)) {
          MiscHelper.response(res, 'need token!', 401)
        } else {
          const dataUser = result[0]
          if (dataUser.activation === '1') {
            MiscHelper.response(res, 'User already actived', 201)
          } else {
            userModels
              .activationUser(code, checkUser[0].email)
              .then(() => {
                MiscHelper.response(res, 'User has been actived', 200)
              })
              .catch(() => {
                MiscHelper.response(res, 'Bad Request', 400)
              })
          }
        }
      })
      .catch(error => {
        console.log('errornya' + error)
        MiscHelper.response(res, 'User not found', 404)
      })
  },

  sendCode: async (req, res) => {
    function makeid (length) {
      var result = ''
      var characters = '0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    }

    userModels
      .sendCode(makeid(4), req.query.email)
      .then(async () => {
        const result = await userModels.getByEmail(req.query.email)
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'helpdesk.hijrahapp@gmail.com',
            pass: 'hijrahapp1234'
          }
        })
        const mailOptions = {
          from: 'helpdesk.hijrahapp@gmail.com',
          to: req.query.email,
          subject: 'Verify Akun',
          html:
            'Hello, ' + result[0].name +
            `<br> Please Insert Code HERE..<br>
            ${result[0].activation_code} `
        }

        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            MiscHelper.response(res, 'Bad Request', 400)
            console.log('Error send email ' + err)
          } else {
            MiscHelper.response(res, 'Sukses Send email', 200)
            console.log('Sukses Send email')
          }
        })
      })
      .catch(error => {
        console.log('errornya' + error)
        MiscHelper.response(res, 'User not found', 404)
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
          MiscHelper.response(res, 'Cloud Server disable', 500)
        } else {
          dataCloudinary = result.url
        }
      })

      return dataCloudinary
    }
    if (checkUser[0] === undefined) {
      MiscHelper.response(res, 'User not found', 204)
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
          MiscHelper.response(res, 'Bad request', 400)
        })
    }
  },

  validateCode: async (req, res) => {
    const userDetail = await userModels.getByEmail(req.query.email)
    const code = req.query.code
    if (userDetail[0] === undefined) {
      MiscHelper.response(res, 'User not found', 204)
    } else {
      userModels.validateCode(code, req.query.email)
        .then((result) => {
          if (validate.isEmpty(result)) {
            MiscHelper.response(res, '', 400, 'Code not match')
          } else {
            const data = {
              email: req.query.email
            }
            MiscHelper.response(res, data, 200, 'Code match')
          }
        })
        .catch((err) => {
          console.log('error ' + err)
          MiscHelper.response(res, 'Bad request', 400)
        })
    }
  },

  forgetPassword: async (req, res) => {
    const checkEmail = await userModels.getByEmail(req.body.email)
    if (checkEmail[0] === undefined) {
      MiscHelper.response(res, 'User not found', 204)
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
          MiscHelper.response(res, 'Bad Request', 400)
          console.log('Error : ' + err)
        })
    }
  }
}
