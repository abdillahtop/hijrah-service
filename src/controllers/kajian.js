const kajianModels = require('../models/kajian')
const organizedModels = require('../models/organized')
const userModels = require('../models/users')
const ustadzModels = require('../models/ustadz')
const categoryModels = require('../models/category')
const MiscHelper = require('../helpers/helpers')
const cloudinary = require('cloudinary')
const uuidv4 = require('uuid/v4')
// const dates = require('dateformat')
const model = require('../helpers/model')
const dateFormat = require('dateformat')
const moment = require('moment')
const config = require('../configs/global_config/config')

module.exports = {
  getIndex: (req, res) => {
    return res.json({
      code: 200,
      message: 'Server Running well, ready to use'
    })
  },

  addKajian: async (req, res, next) => {
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
      MiscHelper.response(res, 'Activation Organized first', 401)
    } else {
      if (req.file === undefined) {
        const date = dateFormat(req.body.endDate, 'yyyy-mm-dd')
        const data = {
          kajian_id: uuidv4(),
          adminKajianId: checkOrganized[0].organized_id,
          adminKajianName: checkOrganized[0].name_organized,
          logoOrganized: checkOrganized[0].profile_url,
          categoryName: checkCategory[0].name,
          location: req.body.location,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          endDateFormat: req.body.timeEnd === 'Selesai' ? moment(date + 'T' + '23:59').format() : moment(date + 'T' + req.body.timeEnd).format(),
          timeStart: req.body.timeStart,
          timeEnd: req.body.timeEnd,
          description: req.body.description,
          title: req.body.title,
          linkVideo: req.body.linkVideo,
          phoneNumber: checkOrganized[0].phone_number,
          latitude: parseFloat(req.body.latitude),
          longitude: parseFloat(req.body.longitude),
          locationMap: req.body.locationMap,
          publishAt: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
          active: true,
          isUstadz: false,
          image: config.defaultKajian,
          count_member: 0,
          payment: req.body.payment
        }
        kajianModels
          .addKajian(data)
          .then(() => {
            MiscHelper.response(res, data.kajian_id, 200, 'Kajian has been Insert')
          })
          .catch(error => {
            MiscHelper.response(res, 'Bad request', 400)
            console.log('erronya ' + error)
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
        const date = dateFormat(req.body.endDate, 'yyyy-mm-dd')
        const data = {
          kajian_id: uuidv4(),
          adminKajianId: checkOrganized[0].organized_id,
          adminKajianName: checkOrganized[0].name_organized,
          logoOrganized: checkOrganized[0].profile_url,
          categoryName: checkCategory[0].name,
          location: req.body.location,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          endDateFormat: req.body.timeEnd === 'Selesai' ? moment(date + 'T' + '23:59').format() : moment(date + 'T' + req.body.timeEnd).format(),
          timeStart: req.body.timeStart,
          timeEnd: req.body.timeEnd,
          description: req.body.description,
          title: req.body.title,
          linkVideo: req.body.linkVideo,
          phoneNumber: checkOrganized[0].phone_number,
          latitude: parseFloat(req.body.latitude),
          longitude: parseFloat(req.body.longitude),
          locationMap: req.body.locationMap,
          publishAt: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
          active: true,
          isUstadz: false,
          image: await geturl(),
          count_member: 0,
          payment: req.body.payment
        }
        kajianModels
          .addKajian(data)
          .then(() => {
            MiscHelper.response(res, data.kajian_id, 200, 'Kajian has been Insert')
          })
          .catch(error => {
            MiscHelper.response(res, 'Bad request', 400)
            console.log('erronya ' + error)
          })
      }
    }
  },

  editKajian: async (req, res, next) => {
    const checkOrganized = await organizedModels.getOrganizer(
      req.user_id
    )
    const checkCategory = await categoryModels.checkCategory(req.body.categoryId)

    const checkKajian = await kajianModels.checkKajian(req.params.kajianId)
    if (checkCategory[0] === undefined) {
      MiscHelper.response(res, 'Category not found', 404)
    } else if (checkOrganized[0] === undefined) {
      MiscHelper.response(res, 'Organized not found', 404)
    } else if (checkKajian[0].kajian_id === undefined) {
      MiscHelper.response(res, 'Kajian not found', 204)
    } else {
      if (req.file === undefined) {
        const date = dateFormat(req.body.endDate, 'yyyy-mm-dd')
        const data = {
          kajian_id: req.params.kajianId,
          adminKajianId: checkOrganized[0].organized_id,
          adminKajianName: checkOrganized[0].name_organized,
          categoryName: checkCategory[0].name,
          location: req.body.location,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          timeStart: req.body.timeStart,
          timeEnd: req.body.timeEnd,
          endDateFormat: req.body.timeEnd === 'Selesai' ? moment(date + 'T' + '23:59').format() : moment(date + 'T' + req.body.timeEnd).format(),
          description: req.body.description,
          title: req.body.title,
          linkVideo: req.body.linkVideo,
          phoneNumber: checkOrganized[0].phone_number,
          latitude: parseFloat(req.body.latitude),
          longitude: parseFloat(req.body.longitude),
          locationMap: req.body.locationMap,
          publishAt: checkKajian[0].publishAt,
          active: checkKajian[0].active,
          isUstadz: checkKajian[0].isUstadz,
          payment: req.body.payment,
          image: checkKajian[0].image,
          count_member: checkKajian[0].count_member
        }
        kajianModels
          .updateKajian(data, req.params.kajianId)
          .then(() => {
            MiscHelper.response(res, 'Kajian has been update', 200)
          })
          .catch(error => {
            MiscHelper.response(res, 'Bad request', 400)
            console.log('erronya ' + error)
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
        const date = dateFormat(req.body.endDate, 'yyyy-mm-dd')
        const data = {
          kajian_id: req.params.kajianId,
          adminKajianId: checkOrganized[0].organized_id,
          adminKajianName: checkOrganized[0].name_organized,
          categoryName: checkCategory[0].name,
          location: req.body.location,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          timeStart: req.body.timeStart,
          timeEnd: req.body.timeEnd,
          endDateFormat: req.body.timeEnd === 'Selesai' ? moment(date + 'T' + '23:59').format() : moment(date + 'T' + req.body.timeEnd).format(),
          description: req.body.description,
          title: req.body.title,
          linkVideo: req.body.linkVideo,
          phoneNumber: checkOrganized[0].phone_number,
          latitude: parseFloat(req.body.latitude),
          longitude: parseFloat(req.body.longitude),
          locationMap: req.body.locationMap,
          publishAt: checkKajian[0].publishAt,
          active: checkKajian[0].active,
          isUstadz: checkKajian[0].isUstadz,
          payment: req.body.payment,
          image: await geturl(),
          count_member: checkKajian[0].count_member
        }
        kajianModels
          .updateKajian(data, req.params.kajianId)
          .then(() => {
            MiscHelper.response(res, 'Kajian has been update', 200)
          })
          .catch(error => {
            MiscHelper.response(res, 'Bad request', 400)
            console.log('erronya ' + error)
          })
      }
    }
  },

  getAllKajian: async (req, res) => {
    const limit = await parseInt(req.query.limit)
    const page = await parseInt(req.query.page)
    const tzoffset = (new Date()).getTimezoneOffset() * 60000 // offset in milliseconds
    const dateNow = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1)
    console.log(dateNow)
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
        MiscHelper.response(res, 'Bad Request', 400)
        console.log('errornya ' + error)
      })
  },

  getAllKajianNearby: async (req, res) => {
    const limit = await parseInt(req.query.limit)
    const page = await parseInt(req.query.page)
    const tzoffset = (new Date()).getTimezoneOffset() * 60000 // offset in milliseconds
    const dateNow = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1)
    const latitude = await req.query.latitude
    const longitude = await req.query.longitude
    kajianModels
      .getKajianAllNearby(dateNow, latitude, longitude, limit, page)
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
        MiscHelper.response(res, 'Bad Request', 400)
        console.log('errornya ' + error)
      })
  },

  getAllKajianPopuler: async (req, res) => {
    const limit = await parseInt(req.query.limit)
    const page = await parseInt(req.query.page)
    const tzoffset = (new Date()).getTimezoneOffset() * 60000 // offset in milliseconds
    const dateNow = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1)
    const latitude = await req.query.latitude
    const longitude = await req.query.longitude
    kajianModels
      .getKajianAllPopuler(dateNow, latitude, longitude, limit, page)
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
        MiscHelper.response(res, 'Bad Request', 400)
        console.log('errornya ' + error)
      })
  },

  getAllKajianByCategory: async (req, res) => {
    const checkCategory = await categoryModels.checkCategory(
      req.query.categoryId
    )
    const limit = await parseInt(req.query.limit)
    const page = await parseInt(req.query.page)
    const tzoffset = (new Date()).getTimezoneOffset() * 60000 // offset in milliseconds
    const dateNow = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1)

    if (checkCategory[0] === undefined) {
      MiscHelper.response(res, 'Category not found', 404)
    } else {
      kajianModels
        .getKajianAllbyCategory(dateNow, checkCategory[0].name, limit, page)
        .then(result => {
          if (result[0] === 0) {
            MiscHelper.response(res, 'Kajian Not Found in This Category', 204)
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
          MiscHelper.response(res, 'Bad Request', 400)
          console.log('errornya ' + error)
        })
    }
  },

  addMemberKajian: async (req, res) => {
    const checkKajian = await kajianModels.checkKajian(req.params.kajianId)
    const checkUser = await userModels.userDetail(req.user_id)
    const checkMember = await kajianModels.checkMemberKajian(
      req.params.kajianId,
      req.user_id
    )
    const memberKajian = await kajianModels.memberKajian(req.params.kajianId)
    if (checkKajian[0] === undefined) {
      MiscHelper.response(res, 'Kajian not found', 404)
    } else if (checkUser[0] === undefined) {
      MiscHelper.response(res, 'User not found', 404)
    } else if (checkMember[0] !== undefined) {
      MiscHelper.response(res, 'User has been Join Kajian', 409)
    } else {
      const data = {
        registration_id: uuidv4(),
        user_id: req.user_id,
        kajian_id: req.params.kajianId,
        image: checkUser[0].profile_url,
        name: checkUser[0].name,
        register_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')
      }
      kajianModels
        .addMemberKajian(data, memberKajian[0] == 0 ? 1 : memberKajian[0].length + 1, req.params.kajianId)
        .then(() => {
          MiscHelper.response(res, 'Member Kajian has been successfull', 200)
        })
        .catch((err) => {
          MiscHelper.response(res, 'Bad Request', 400, err)
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
      .catch(error => {
        MiscHelper.response(res, 'Bad Request', 400)
        console.log('errornya ' + error)
      })
  },

  getKajianbyUser: async (req, res) => {
    const active = req.params.active
    kajianModels
      .getKajianByUser(req.user_id, active)
      .then(result => {
        if (result === '') {
          MiscHelper.resPagination(res, 'Kajian not found', 204)
        } else {
          MiscHelper.resPagination(res, result, 200)
        }
      })
      .catch(error => {
        MiscHelper.response(res, 'Bad Request', 400)
        console.log('errornya ' + error)
      })
  },

  getKajianbyOrganized: async (req, res) => {
    const limit = await parseInt(req.query.limit)
    const page = await parseInt(req.query.page)
    const tzoffset = (new Date()).getTimezoneOffset() * 60000 // offset in milliseconds
    const dateNow = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1)
    const checkOrganized = await organizedModels.getOrganizer(
      req.user_id
    )
    const checkCategory = await categoryModels.checkCategory(req.query.categoryId)

    if (checkCategory[0] === undefined) {
      MiscHelper.response(res, 'Category not found', 404)
    }
    if (checkOrganized[0] === undefined) {
      MiscHelper.response(res, 'Organized not found', 404)
    }

    kajianModels
      .getKajinbyOrganized(dateNow, checkOrganized[0].organized_id, checkCategory[0].name, limit, page)
      .then(result => {
        if (result === '') {
          MiscHelper.resPagination(res, 'Kajian not found', 204)
        } else {
          MiscHelper.resPagination(res,
            result[0],
            200,
            result[1],
            result[2],
            result[3])
        }
      })
      .catch(error => {
        MiscHelper.response(res, 'Bad Request', 400)
        console.log('errornya ' + error)
      })
  },

  findKajian: async (req, res) => {
    const catId = await req.query.catId
    const search = await req.query.search
    const latitude = await req.query.latitude
    const longitude = await req.query.longitude
    const limit = await parseInt(req.query.limit)
    const page = await parseInt(req.query.page)
    const tzoffset = (new Date()).getTimezoneOffset() * 60000 // offset in milliseconds
    const dateNow = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1)
    if (catId === '') {
      kajianModels
        .findKajian(dateNow, latitude, longitude, search, limit, page)
        .then(result => {
          if (result[0] === undefined) {
            MiscHelper.response(res, 'list kajian not found', 204)
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
          MiscHelper.response(res, 'Bad Request', 400)
          console.log('errornya ' + error)
        })
    } else {
      const checkCategory = await categoryModels.checkCategory(catId)
      if (checkCategory[0] === undefined) {
        MiscHelper.response(res, 'Category not found', 404)
      } else {
        kajianModels.findKajianByCat(dateNow, checkCategory[0].name, latitude, longitude, search, limit, page)
          .then((result) => {
            if (result[0] === undefined) {
              MiscHelper.response(res, 'list kajian not found', 204)
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
            MiscHelper.response(res, 'Bad Request', 400)
            console.log('errornya ' + error)
          })
      }
    }
  },

  unjoinKajian: async (req, res) => {
    const kajianId = await req.query.kajianId
    const checkMemberKajian = await kajianModels.checkMemberKajian(kajianId, req.user_id)
    const memberKajian = await kajianModels.memberKajian(req.query.kajianId)
    if (checkMemberKajian[0] === undefined) {
      MiscHelper.response(res, 'you not join in this kajian', 401)
    } else {
      kajianModels
        .unjoinKajian(req.user_id, memberKajian[0].length - 1, kajianId)
        .then(() => {
          MiscHelper.response(res, 'Success Unjoin Event', 200)
        })
        .catch(error => {
          MiscHelper.response(res, 'Bad request', 400)
          console.log('error ' + error)
        })
    }
  },

  deleteKajian: async (req, res) => {
    const checkOrganized = await organizedModels.getOrganizer(
      req.user_id
    )
    if (checkOrganized[0] === undefined) {
      MiscHelper.response(res, 'Your Organized not registered', 404)
    } else {
      const checkKajian = await kajianModels.checkKajianbyUserId(checkOrganized[0].organized_id)
      if (checkKajian[0] === undefined) {
        MiscHelper.response(res, 'Kajian not found', 404)
      } else {
        let status = true
        checkKajian.map(async (value, index) => {
          if (value.kajian_id === req.params.kajianId) {
            status = false
            await kajianModels.deleteKajian(value.adminKajianId, req.params.kajianId)
              .then(() => {
                MiscHelper.response(res, 'Kajian has been delete', 200)
              })
              .catch(() => {
                MiscHelper.response(res, 'Bad Request', 400)
              })
          }
        })
        if (status) {
          MiscHelper.response(res, 'Kajian not found', 204)
        }
      }
    }
  },

  deleteKajianUser: async (req, res) => {
    const kajianId = await req.params.kajianId
    const checkUser = await userModels.getUser(
      req.user_id
    )
    if (checkUser[0] === undefined) {
      MiscHelper.response(res, 'User not found', 404)
    } else {
      const checkMemberKajian = await kajianModels.checkMemberKajian(kajianId, req.user_id)
      if (checkMemberKajian[0] === undefined) {
        MiscHelper.response(res, 'Kajian not found', 204)
      } else {
        kajianModels.deleteKajianbyUser(checkMemberKajian[0].registration_id)
          .then(() => {
            MiscHelper.response(res, '', 200, 'Delete kajian success')
          })
          .catch(() => {
            MiscHelper.response(res, 'Bad resuest', 400)
          })
      }
    }
  },

  detailKajian: async (req, res) => {
    if (req.user_id === undefined) {
      const checkKajian = await kajianModels.checkKajian(req.params.kajianId)
      const kajian = checkKajian[0]
      console.log(kajian)
      if (kajian === undefined) {
        MiscHelper.response(res, 'Kajian not found', 204)
      } else {
        const checkOrganized = await organizedModels.checkOrganized(checkKajian[0].adminKajianId)
        const memberKajian = await kajianModels.memberKajian(req.params.kajianId)
        const listUstadz = await ustadzModels.getUstadzByKajian(req.params.kajianId)
        if (checkOrganized[0] === undefined) {
          MiscHelper.response(res, 'Organized not found', 404)
        } else {
          const detailEvent = []
          const listMember = []
          const listUstadzs = []
          const detailKajian = model.detailKajian()
          detailKajian.kajian_id = req.params.kajianId
          detailKajian.adminKajianName = checkKajian[0].adminKajianName
          detailKajian.logoOrganized = checkOrganized[0].profile_url
          detailKajian.title = kajian.title
          detailKajian.categoryName = kajian.categoryName
          detailKajian.image = kajian.image
          detailKajian.kajianId = kajian.kajianId
          detailKajian.linkVideo = kajian.linkVideo
          detailKajian.startDate = kajian.startDate
          detailKajian.phoneNumber = checkOrganized[0].phone_number
          detailKajian.endDate = kajian.endDate
          detailKajian.timeStart = kajian.timeStart
          detailKajian.timeEnd = kajian.timeEnd
          detailKajian.description = kajian.description
          detailKajian.location = kajian.location
          detailKajian.locationMap = kajian.locationMap
          detailKajian.latitude = kajian.latitude
          detailKajian.longitude = kajian.longitude
          if (memberKajian[0] === '') {
            listMember.push('Nothing Member here')
          } else {
            listMember.push(memberKajian[0])
          }
          const attend = listMember[0]
          detailKajian.attended = attend.slice(0, 3)

          if (memberKajian[1] <= 3) {
            detailKajian.countAttended = 0
          } else if (memberKajian[1] < 50) {
            const attent = memberKajian[1].toString() - 3
            detailKajian.countAttended = attent
          } else if (memberKajian[1] < 100) {
            detailKajian.countAttended = '50+'
          } else if (memberKajian[1] < 500) {
            detailKajian.countAttended = '100+'
          } else if (memberKajian[1] < 1000) {
            detailKajian.countAttended = '1K'
          } else {
            detailKajian.countAttended = memberKajian[1]
          }
          if (listUstadz[0] === '') {
            listUstadzs.push('nothing Ustadz here')
          } else {
            listUstadzs.push(listUstadz)
          }
          detailKajian.isJoin = false
          detailKajian.ustadz = listUstadzs[0]
          detailKajian.payment = kajian.payment
          detailEvent.push(detailKajian)
          MiscHelper.response(res, detailEvent[0], 200, 'Get Detail Kajian Success')
        }
      }
    } else {
      const checkKajian = await kajianModels.checkKajian(req.params.kajianId)
      const kajian = checkKajian[0]
      if (kajian === undefined) {
        MiscHelper.response(res, 'Kajian not found', 204)
      } else {
        const checkOrganized = await organizedModels.checkOrganized(checkKajian[0].adminKajianId)
        const memberKajian = await kajianModels.memberKajian(req.params.kajianId)
        const listUstadz = await ustadzModels.getUstadzByKajian(req.params.kajianId)
        if (checkOrganized[0] === undefined) {
          MiscHelper.response(res, 'Organized not found', 404)
        } else {
          const detailEvent = []
          const listMember = []
          const listUstadzs = []
          const detailKajian = model.detailKajian()
          detailKajian.kajian_id = req.params.kajianId
          detailKajian.adminKajianName = checkKajian[0].adminKajianName
          detailKajian.logoOrganized = checkOrganized[0].profile_url
          detailKajian.title = kajian.title
          detailKajian.image = kajian.image
          detailKajian.categoryName = kajian.categoryName
          detailKajian.kajianId = kajian.kajianId
          detailKajian.linkVideo = kajian.linkVideo
          detailKajian.startDate = kajian.startDate
          detailKajian.endDate = kajian.endDate
          detailKajian.timeStart = kajian.timeStart
          detailKajian.timeEnd = kajian.timeEnd
          detailKajian.description = kajian.description
          detailKajian.phoneNumber = checkOrganized[0].phone_number
          detailKajian.location = kajian.location
          detailKajian.locationMap = kajian.locationMap
          detailKajian.latitude = kajian.latitude
          detailKajian.longitude = kajian.longitude
          if (memberKajian[0] === '') {
            listMember.push('Nothing Member here')
          } else {
            listMember.push(memberKajian[0])
          }
          const attend = listMember[0]
          detailKajian.attended = attend.slice(0, 3)
          if (memberKajian[1] < 50) {
            detailKajian.countAttended = 0
          } else if (memberKajian[1] < 100) {
            detailKajian.countAttended = '50+'
          } else if (memberKajian[1] < 500) {
            detailKajian.countAttended = '100+'
          } else if (memberKajian[1] < 1000) {
            detailKajian.countAttended = '1K'
          } else {
            detailKajian.countAttended = memberKajian[1]
          }
          if (listUstadz[0] === '') {
            listUstadzs.push('nothing Ustadz here')
          } else {
            listUstadzs.push(listUstadz)
          }
          const checkMember = await kajianModels.checkMemberKajian(req.params.kajianId, req.user_id)
          if (checkMember[0] !== undefined) {
            detailKajian.isJoin = true
          } else {
            detailKajian.isJoin = false
          }
          detailKajian.payment = kajian.payment
          detailKajian.ustadz = listUstadzs[0]
          detailEvent.push(detailKajian)
          const data = detailEvent[0]
          MiscHelper.response(res, data, 200, 'Get Detail Kajian Success')
        }
      }
    }
  }
}
