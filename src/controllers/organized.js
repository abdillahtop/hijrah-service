const userModels = require('../models/users')
const organizedModels = require('../models/organized')
const MiscHelper = require('../helpers/helpers')
const uuidv4 = require('uuid/v4')
const dateFormat = require('dateformat')
const nodemailer = require('nodemailer')
const validate = require('validate.js')

module.exports = {
  getIndex: (req, res) => {
    return res.json({
      code: 200,
      message: 'Server Running well, ready to use'
    })
  },

  register: async (req, res) => {
    const checkOrganized = await organizedModels.getOrganizer(req.user_id)

    if (checkOrganized[0] === undefined) {
      const checkUser = await organizedModels.getUser(req.user_id)

      if (checkUser[0] === undefined) {
        MiscHelper.response(res, 'User not found', 204)
      } else {
        const data = {
          organized_id: uuidv4(),
          user_id: req.user_id,
          name_organized: req.body.nameOrganized,
          email: checkUser[0].email,
          salt: checkUser[0].salt,
          password: checkUser[0].password,
          address: req.body.address,
          profile_url: req.body.profileUrl,
          phone_number: req.body.phoneNumber,
          description: req.body.description,
          management: req.body.nameManagement,
          created_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
          updated_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
          activation: 0
        }
        organizedModels
          .registerOrganizer(data)
          .then(() => {
            MiscHelper.response(res, 'Organized has been register', 200)
          })
          .catch(error => {
            MiscHelper.response(res, 'Bad Request', 400)
            console.log('error ' + error)
          })
      }
    } else {
      MiscHelper.response(res, 'Organized has been used', 401)
    }
  },

  organizedDetail: async (req, res) => {
    organizedModels.getOrganizer(req.user_id)
      .then((result) => {
        if (result[0] === undefined) {
          MiscHelper.response(res, 'Organized not found', 404)
        } else {
          MiscHelper.response(res, result[0], 200)
        }
      })
      .catch((err) => {
        MiscHelper.response(res, 'Bad request', 400)
        console.log(err)
      })
  },

  activeOrganized: async (req, res) => {
    if (req.roleId === 4) {
      const OrganizedDetail = await organizedModels.checkOrganized(req.query.organizedId)

      if (OrganizedDetail[0] === undefined) {
        MiscHelper.response(res, 'Organized not found', 401)
      } else {
        organizedModels.activationOrganized(req.query.organizedId)
          .then(() => {
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'helpdesk.hijrahapp@gmail.com',
                pass: 'hijrahapp1234'
              }
            })
            const mailOptions = {
              from: 'helpdesk.hijrahapp@gmail.com',
              to: OrganizedDetail[0].email,
              subject: 'Palapaone',
              html:
                'Hello, ' + OrganizedDetail[0].name_organized +
                '<br>Selamat akun penyelenggara anda telah veritifikasi, yuk posting acara kajian anda di Aplikasi hijrah...<br>'
            }
            transporter.sendMail(mailOptions, function (err, info) {
              if (err) {
                console.log('Error send email ' + err)
              } else {
                console.log('Sukses Send email')
              }
            })
            MiscHelper.response(res, 'Organized actived', 200)
          })
          .catch(() => {
            MiscHelper.response(res, 'Bad request', 400)
          })
      }
    } else {
      MiscHelper.response(res, 'Your role not allowed', 201)
    }
  },

  updateOrganized: async (req, res) => {
    const checkUser = await userModels.getUser(req.user_id)
    const organizedDetail = await organizedModels.getOrganizer(req.user_id)
    if (checkUser[0] === undefined) {
      MiscHelper.response(res, 'User not found', 204)
    } else if (organizedDetail[0] === undefined) {
      MiscHelper.response(res, 'User not found', 204)
    } else {
      const data = {
        organized_id: organizedDetail[0].organized_id,
        user_id: req.user_id,
        name_organized: validate.isEmpty(req.body.nameOrganized) ? organizedDetail[0].name_organized : req.body.nameOrganized,
        email: checkUser[0].email,
        salt: checkUser[0].salt,
        password: checkUser[0].password,
        address: validate.isEmpty(req.body.address) ? organizedDetail[0].address : req.body.address,
        profile_url: validate.isEmpty(req.body.profileUrl) ? organizedDetail[0].profile_url : req.body.profileUrl,
        phone_number: validate.isEmpty(req.body.phoneNumber) ? organizedDetail[0].phone_number : req.body.phoneNumber,
        description: validate.isEmpty(req.body.description) ? organizedDetail[0].description : req.body.description,
        management: validate.isEmpty(req.body.nameManagement) ? organizedDetail[0].management : req.body.nameManagement,
        created_at: organizedDetail[0].created_at,
        updated_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        activation: organizedDetail[0].activation
      }
      organizedModels.updateOrganized(data, req.user_id)
        .then(() => {
          MiscHelper.response(res, 'Data has been updated', 200)
        })
        .catch((err) => {
          console.log(err)
          MiscHelper.response(res, 'Bad request', 400)
        })
    }
  },

  listOrganized: async (req, res) => {
    if (req.roleId === 4) {
      const limit = await parseInt(req.query.limit)
      const page = await parseInt(req.query.page)
      organizedModels.listOrganized(limit, page)
        .then((result) => {
          if (result[0] === '') {
            MiscHelper.response(res, 'Not found member', 204)
          } else {
            MiscHelper.resPagination(
              res,
              result[0],
              200,
              result[1],
              result[2],
              result[3]
            )
          }
        })
    }
  },

  deleteOrganized: async (req, res) => {
    if (req.roleId === 4) {
      const checkOrganized = await organizedModels.checkOrganized(req.params.organizedId)

      if (checkOrganized[0] === undefined) {
        MiscHelper.response(res, 'Organized not found', 401)
      } else {
        organizedModels.deleteOrganized(req.params.organizedId, checkOrganized[0].user_id)
          .then(() => {
            MiscHelper.response(res, 'Organized has been delete', 200)
          })
          .catch(() => {
            MiscHelper.response(res, 'Bad Request', 400)
          })
      }
    }
    MiscHelper.response(res, 'Your role noot allowed', 400)
  }
}
