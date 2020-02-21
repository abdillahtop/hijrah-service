const inboxModels = require('../models/inbox')
const userModels = require('../models/users')
const MiscHelper = require('../helpers/helpers')
const cloudinary = require('cloudinary')
const uuidv4 = require('uuid/v4')
// const dates = require('dateformat')
const dateFormat = require('dateformat')
// const moment = require('moment')
const config = require('../configs/global_config/config')

module.exports = {
  getIndex: (req, res) => {
    return res.json({
      code: 200,
      message: 'Server Running well, ready to use'
    })
  },

  getInboxbyUser: async (req, res) => {
    const checkUser = await userModels.getUser(req.user_id)

    if (checkUser[0] === undefined) {
      MiscHelper.response(res, 'User not found', 404)
    } else {
      inboxModels.getInboxbyUser(req.user_id)
        .then((result) => {
          inboxModels.isReadInbox(req.user_id)
          MiscHelper.response(res, result, 200)
        })
        .catch(() => {
          MiscHelper.response(res, 'Bad request', 400)
        })
    }
  },

  checkInbox: async (req, res) => {
    const checkUser = await userModels.getUser(req.user_id)

    if (checkUser[0] === undefined) {
      MiscHelper.response(res, 'User not found', 404)
    } else {
      inboxModels.checkInbox(req.user_id)
        .then((result) => {
          MiscHelper.response(res, result[0], 200)
        })
        .catch(() => {
          MiscHelper.response(res, 'Bad request', 200)
        })
    }
  },

  sendInboxbyAdmin: async (req, res) => {
    if (req.roleId === 4) {
      const allUser = await userModels.getUsers()
      // console.log(allUser)

      if (req.file === undefined) {
        allUser.map(async (data, v) => {
          if (data.role_id === 1) {
            const payload = {
              inbox_id: uuidv4(),
              user_id: data.user_id,
              created_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
              content: req.body.content,
              isRead: 0,
              title: req.body.title,
              logo: config.logoHIjrah
            }
            inboxModels.addInbox(payload)
              .then(() => {
                MiscHelper.response(res, 'Send to inbox success', 200)
              })
              .catch(() => {
                MiscHelper.response(res, 'Bad request', 400)
              })
          }
        })
      } else {
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

        const url = await geturl()
        allUser.map(async (data, v) => {
          if (data.role_id === 1) {
            const payload = {
              inbox_id: uuidv4(),
              user_id: data.user_id,
              created_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
              content: req.body.content,
              isRead: 0,
              title: req.body.title,
              logo: config.logoHIjrah,
              image: url
            }
            inboxModels.addInbox(payload)
              .then(() => {
                MiscHelper.response(res, 'Send to inbox success', 200)
              })
              .catch(() => {
                MiscHelper.response(res, 'Bad request', 400)
              })
          }
        })
      }
    } else {
      MiscHelper.response(res, 'Your Role not allowed', 400)
    }
  }
}
