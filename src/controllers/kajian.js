const kajianModels = require('../models/kajian')
const organizedModels = require('../models/organized')
const userModels = require('../models/users')
const categoryModels = require('../models/category')
const MiscHelper = require('../helpers/helpers')
const cloudinary = require('cloudinary')
const uuidv4 = require('uuid/v4')
const dateFormat = require('dateformat')

module.exports = {
  getIndex: (req, res) => {
    return res.json({
      code: 200,
      message: 'Server Running well, ready to use'
    })
  },

  addKajian: async (req, res, next) => {
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

    const checkOrganized = await organizedModels.getOrganizer(
      req.user_id
    )
    const checkCategory = await categoryModels.checkCategory(req.body.categoryId)

    if (checkCategory[0] === undefined) {
      MiscHelper.response(res, 'Category not found', 404)
      next()
    }
    if (checkOrganized[0] === undefined) {
      MiscHelper.response(res, 'Organized not found', 404)
    } else if (checkOrganized[0].activation === '0') {
      MiscHelper.response(res, 'Activation Organized first', 200)
    } else {
      const data = {
        kajian_id: uuidv4(),
        adminKajianId: checkOrganized[0].organized_id,
        adminKajianName: req.body.adminNameKajian,
        categoryName: checkCategory[0].name,
        location: req.body.location,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        startDateFormat: dateFormat(req.body.startDate, 'yyyy-mm-dd'),
        endDateFormat: dateFormat(req.body.endDate, 'yyyy-mm-dd'),
        description: req.body.description,
        title: req.body.title,
        linkVideo: req.body.linkVideo,
        kajianPhoneNumber: req.body.phoneNumber,
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
        locationMap: req.body.locationMap,
        publishAt: dateFormat(new Date().toLocaleString(), 'isoDateTime'),
        active: true,
        image: await geturl()
      }
      kajianModels
        .addKajian(data)
        .then(() => {
          MiscHelper.response(res, 'Kajian has been Insert', 200)
        })
        .catch(error => {
          MiscHelper.response(res, 'Bad request', 404)
          console.log('erronya ' + error)
        })
    }
  },

  getAllKajian: async (req, res) => {
    const limit = await parseInt(req.query.limit)
    const page = await parseInt(req.query.page)
    const dateNow = await dateFormat(new Date().toLocaleString(), 'isoDateTime')
    kajianModels
      .getKajianAll(dateNow, limit, page)
      .then(result => {
        MiscHelper.resPagination(
          res,
          result[0],
          200,
          result[1],
          result[2],
          result[3]
        )
      })
      .catch(error => {
        MiscHelper.response(res, 'Bad Request', 404)
        console.log('errornya ' + error)
      })
  },

  getAllKajianByCategory: async (req, res) => {
    const checkCategory = await categoryModels.checkCategory(
      req.query.categoryId
    )
    const limit = await parseInt(req.query.limit)
    const page = await parseInt(req.query.page)
    const dateNow = await dateFormat(new Date().toLocaleString(), 'isoDateTime')

    if (checkCategory[0] === undefined) {
      MiscHelper.response(res, 'Category not found', 404)
    } else {
      kajianModels
        .getKajianAllbyCategory(dateNow, checkCategory[0].name, limit, page)
        .then(result => {
          if (result[0] === 0) {
            MiscHelper.response(res, 'Kajian Not Found in This Category', 200)
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
        .catch(error => {
          MiscHelper.response(res, 'Bad Request', 404)
          console.log('errornya ' + error)
        })
    }
  },

  addMemberKajian: async (req, res) => {
    const checkKajian = await kajianModels.checkKajian(req.body.kajianId)
    const checkUser = await userModels.userDetail(req.user_id)
    const checkMember = await kajianModels.checkMemberKajian(
      req.body.kajianId,
      req.user_id
    )
    if (checkKajian[0] === undefined) {
      MiscHelper.response(res, 'Kajian not found', 404)
    } else if (checkUser[0] === undefined) {
      MiscHelper.response(res, 'User not found', 404)
    } else if (checkMember[0] !== undefined) {
      MiscHelper.response(res, 'User has been Join Kajian', 200)
    } else if (checkUser[0].activation === 0) {
      MiscHelper.response(res, 'You must Activation first', 401)
    } else {
      const data = {
        registration_id: uuidv4(),
        user_id: req.user_id,
        kajian_id: req.body.kajianId,
        register_at: dateFormat(new Date().toLocaleString(), 'isoDateTime')
      }
      kajianModels
        .addMemberKajian(data)
        .then(() => {
          MiscHelper.response(res, 'Member Kajian has been successfull', 200)
        })
        .catch(() => {
          MiscHelper.response(res, 'Bad Request', 404)
        })
    }
  },

  getMemberKajianAll: async (req, res) => {
    const limit = await parseInt(req.query.limit)
    const page = await parseInt(req.query.page)
    const kajianId = await req.query.kajianId
    kajianModels
      .memberKajianAll(kajianId, limit, page)
      .then(result => {
        if (result[0] === '') {
          MiscHelper.response(res, 'Not found member', 200)
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
      .catch(error => {
        MiscHelper.response(res, 'Bad Request', 404)
        console.log('errornya ' + error)
      })
  },

  getKajianbyUser: async (req, res) => {
    const active = await req.query.active
    kajianModels
      .getKajianByUser(req.user_id, active)
      .then(result => {
        if (result === '') {
          MiscHelper.resPagination(res, 'Kajian not found', 200)
        } else {
          MiscHelper.resPagination(res, result, 200)
        }
      })
      .catch(error => {
        MiscHelper.response(res, 'Bad Request', 404)
        console.log('errornya ' + error)
      })
  },

  findKajian: async (req, res) => {
    const search = await req.query.search
    kajianModels
      .findKajian(search)
      .then(result => {
        if (result === []) {
          MiscHelper.response(res, 'list kajian not found', 200)
        } else {
          MiscHelper.response(res, result, 200)
        }
      })
      .catch(error => {
        MiscHelper.response(res, 'Bad Request', 404)
        console.log('errornya ' + error)
      })
  },

  unjoinKajian: async (req, res) => {
    const kajianId = await req.query.kajianId
    const checkMemberKajian = await kajianModels.checkMemberKajian(kajianId, req.user_id)
    if (checkMemberKajian[0] === undefined) {
      MiscHelper.response(res, 'you not join in this kajian', 404)
    } else {
      kajianModels
        .unjoinKajian(req.user_id, kajianId)
        .then(() => {
          MiscHelper.response(res, 'Success Unjoin Event', 200)
        })
        .catch(error => {
          MiscHelper.response(res, 'Bad request', 404)
          console.log('error ' + error)
        })
    }
  },

  deleteKajian: async (req, res) => {
    const checkKajian = await kajianModels.checkKajianbyUserId(req.user_id)
    if (checkKajian[0] === undefined) {
      MiscHelper.response(res, 'Kajian not found', 404)
    } else {
      kajianModels.deleteKajian(req.user_id, checkKajian[0].kajian_id)
        .then(() => {
          MiscHelper.response(res, 'Kajian has been delete', 200)
        })
        .catch(() => {
          MiscHelper.response(res, 'Bad Request', 404)
        })
    }
  }
}
