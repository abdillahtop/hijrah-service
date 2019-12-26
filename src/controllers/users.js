const userModels = require('../models/users');
const MiscHelper = require('../helpers/helpers');
const nodemailer = require('nodemailer');
const axios = require('axios');
const uuidv4 = require('uuid/v4');
const domain = require('../configs/global_config/config')
const dateFormat = require('dateformat');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2
const validate = require('validate.js')

module.exports = {
  getIndex: (req, res) => {
    return res.json({ code: 200, message: 'Server Running well, ready to use' })
  },

  getUsers: (req, res) => {
    userModels.getUsers((err, result) => {
      if (err) console.log(err)

      MiscHelper.response(res, result, 200)
    })
  },

  userDetail: (req, res) => {
    const user_id = req.params.userid

    userModels.userDetail(user_id)
      .then((resultUser) => {
        const result = resultUser[0]
        MiscHelper.response(res, result, 200)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  register: async (req, res) => {
    const checkEmail = await userModels.getByEmail(req.body.email)
    console.log("hello "+checkEmail[0])
    if (checkEmail[0] == undefined) {
      const salt = MiscHelper.generateSalt(64)
      const passwordHash = MiscHelper.setPassword(req.body.password, salt)

      const data = {
        user_id: uuidv4(),
        email: req.body.email,
        name: req.body.name,
        password: passwordHash.passwordHash,
        salt: passwordHash.salt,
        profile_url: 'default',
        activation: 0,
        created_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        updated_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        role_id: 1,
        verified: false,
        isOrganized: false
      }

      userModels.register(data)
        .then(async (resultRegister) => {
          await MiscHelper.response(res, 'Data has been saved', 200)
          let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'roronoazum@gmail.com',
              pass: 'sewelas11'
            }
          });
          let body =await `${domain.baseUrl}/api/v1/user/activation?email=${req.body.email}`
          console.log("hello "+body)
          const mailOptions = {
            from: 'roronoazum@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: 'Verify Akun', // Subject line
            html: "Hello, "+req.body.name+"<br> Please Click on the link to verify your email.<br><a href=" + body + ">Click here to verify</a>"
          };
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              console.log(err)
            }
            else {
              res.json('Sukses')
              console.log('suskses')
            }
          });
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      MiscHelper.response(res, 'Email has been used', 404)
    }

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
            user_id: dataUser.user_id
          }, process.env.SECRET_KEY, { expiresIn: '1000h' })

          delete dataUser.salt
          delete dataUser.password
          // delete dataUser.token
          userModels.updateToken(dataUser.token, dataUser.email)
          return MiscHelper.response(res, dataUser.token, 200)
        } else {
          return MiscHelper.response(res, null, 403, 'Wrong password!')
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },

  activationUser: (req, res) => {
    const email = req.query.email
    userModels.getByEmail(email)
      .then((result) => {
        if (validate.isEmpty(email)) {
          MiscHelper.response(res, 'need token!', 403)
        } else {
          const dataUser = result[0]
          if (dataUser.activation == '1') {
            MiscHelper.response(res, 'User already actived', 202)
          } else {
            userModels.activationUser(email)
              .then(() => {
                MiscHelper.response(res, 'User has been actived', 200)
              })
              .catch(() => {
                MiscHelper.response(res, 'Bad Request', 404)
              })
          }
        }
      })
      .catch((error) => {
        console.log("inih" + error)
        MiscHelper.response(res, 'User not found', 404)
      })
  },

  cloudinary: async (req, res) => {
    const file = await req.file
    console.log(file)

    cloudinary.config({
      cloud_name: 'milkovich',
      api_key: '498688251622387',
      api_secret: 'uOa4edAZOjGvDCCBkpXrT-3bLk8'
    })

    cloudinary.uploader.upload(req.file, (err, result) => {
      console.log(result, err)
    })
  }
}
