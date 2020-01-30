const kajianModels = require('../models/kajian')
const organizedModels = require('../models/organized')
const userModels = require('../models/users')
const ustadzModels = require('../models/ustadz')
const categoryModels = require('../models/category')
const MiscHelper = require('../helpers/helpers')
const cloudinary = require('cloudinary')
const uuidv4 = require('uuid/v4')
const model = require('../helpers/model')
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
          MiscHelper.response(res, 'Cloud Server disable', 500)
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
      MiscHelper.response(res, 'Activation Organized first', 401)
    } else {
      if (req.body.categoryId === 3) {
        const date = dateFormat(req.body.endDate, 'yyyy-mm-dd')
        const data = {
          kajian_id: uuidv4(),
          adminKajianId: checkOrganized[0].organized_id,
          adminKajianName: req.body.adminNameKajian,
          categoryName: checkCategory[0].name,
          location: req.body.location,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          endDateFormat: date + 'T' + req.body.timeEnd,
          timeStart: req.body.timeStart,
          timeEnd: req.body.timeEnd,
          description: req.body.description,
          title: req.body.title,
          linkVideo: req.body.linkVideo,
          kajianPhoneNumber: req.body.phoneNumber,
          latitude: parseFloat(req.body.latitude),
          longitude: parseFloat(req.body.longitude),
          locationMap: req.body.locationMap,
          publishAt: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
          active: true,
          isUstadz: true,
          image: await geturl(),
          count_member: 0
        }
        kajianModels
          .addKajian(data)
          .then(() => {
            MiscHelper.response(res, 'Kajian has been Insert', 200)
          })
          .catch(error => {
            MiscHelper.response(res, 'Bad request', 400)
            console.log('erronya ' + error)
          })
      } else {
        const date = dateFormat(req.body.endDate, 'yyyy-mm-dd')
        const data = {
          kajian_id: uuidv4(),
          adminKajianId: checkOrganized[0].organized_id,
          adminKajianName: req.body.adminNameKajian,
          categoryName: checkCategory[0].name,
          location: req.body.location,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          endDateFormat: date + 'T' + req.body.timeEnd,
          timeStart: req.body.timeStart,
          timeEnd: req.body.timeEnd,
          description: req.body.description,
          title: req.body.title,
          linkVideo: req.body.linkVideo,
          kajianPhoneNumber: req.body.phoneNumber,
          latitude: parseFloat(req.body.latitude),
          longitude: parseFloat(req.body.longitude),
          locationMap: req.body.locationMap,
          publishAt: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
          active: true,
          isUstadz: false,
          image: await geturl(),
          count_member: 0
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

    const checkOrganized = await organizedModels.getOrganizer(
      req.user_id
    )
    const checkCategory = await categoryModels.checkCategory(req.body.categoryId)

    const checkKajian = await kajianModels.checkKajian(req.params.kajianId)
    console.log(JSON.stringify(checkOrganized))
    if (checkCategory[0] === undefined) {
      MiscHelper.response(res, 'Category not found', 404)
      next()
    }
    if (checkOrganized[0] === undefined) {
      MiscHelper.response(res, 'Organized not found', 404)
    } else if (checkKajian[0].kajian_id === undefined) {
      MiscHelper.response(res, 'Kajian not found', 202)
    } else {
      if (req.body.categoryId === 3) {
        const date = dateFormat(req.body.endDate, 'yyyy-mm-dd')
        const data = {
          kajian_id: checkKajian[0].kajian_id,
          adminKajianId: checkOrganized[0].organized_id,
          adminKajianName: req.body.adminNameKajian,
          categoryName: checkCategory[0].name,
          location: req.body.location,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          endDateFormat: date + 'T' + req.body.timeEnd,
          timeStart: req.body.timeStart,
          timeEnd: req.body.timeEnd,
          description: req.body.description,
          title: req.body.title,
          linkVideo: req.body.linkVideo,
          kajianPhoneNumber: req.body.phoneNumber,
          latitude: parseFloat(req.body.latitude),
          longitude: parseFloat(req.body.longitude),
          locationMap: req.body.locationMap,
          publishAt: checkKajian[0].publishAt,
          active: true,
          isUstadz: true,
          image: await geturl(),
          count_member: checkKajian[0].count_member
        }
        kajianModels
          .updateKajian(data)
          .then(() => {
            MiscHelper.response(res, 'Kajian has been Insert', 200)
          })
          .catch(error => {
            MiscHelper.response(res, 'Bad request', 400)
            console.log('erronya ' + error)
          })
      } else {
        const date = dateFormat(req.body.endDate, 'yyyy-mm-dd')
        const data = {
          kajian_id: checkKajian[0].kajian_id,
          adminKajianId: checkOrganized[0].organized_id,
          adminKajianName: req.body.adminNameKajian,
          categoryName: checkCategory[0].name,
          location: req.body.location,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          endDateFormat: date + 'T' + req.body.timeEnd,
          timeStart: req.body.timeStart,
          timeEnd: req.body.timeEnd,
          description: req.body.description,
          title: req.body.title,
          linkVideo: req.body.linkVideo,
          kajianPhoneNumber: req.body.phoneNumber,
          latitude: parseFloat(req.body.latitude),
          longitude: parseFloat(req.body.longitude),
          locationMap: req.body.locationMap,
          publishAt: checkKajian[0].publishAt,
          active: true,
          isUstadz: true,
          image: await geturl(),
          count_member: checkKajian[0].count_member
        }
        kajianModels
          .updateKajian(data)
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

  getAllKajian: async (req, res) => {
    const limit = await parseInt(req.query.limit)
    const page = await parseInt(req.query.page)
    const dateNow = new Date()
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
    const dateNow = new Date()
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
    const dateNow = new Date()
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
    const dateNow = new Date()

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
    const checkKajian = await kajianModels.checkKajian(req.body.kajianId)
    const checkUser = await userModels.userDetail(req.user_id)
    const checkMember = await kajianModels.checkMemberKajian(
      req.body.kajianId,
      req.user_id
    )
    const memberKajian = await kajianModels.memberKajian(req.body.kajianId)
    if (checkKajian[0] === undefined) {
      MiscHelper.response(res, 'Kajian not found', 404)
    } else if (checkUser[0] === undefined) {
      MiscHelper.response(res, 'User not found', 404)
    } else if (checkMember[0] !== undefined) {
      MiscHelper.response(res, 'User has been Join Kajian', 201)
    } else {
      const data = {
        registration_id: uuidv4(),
        user_id: req.user_id,
        kajian_id: req.body.kajianId,
        image: checkUser[0].profile_url,
        name: checkUser[0].name,
        register_at: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')
      }
      kajianModels
        .addMemberKajian(data, memberKajian[0] == 0 ? 1 : memberKajian[0].length + 1, req.body.kajianId)
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
    const active = await req.query.active
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
    const active = req.query.active
    const dateNow = new Date()
    const checkOrganized = await organizedModels.getOrganizer(
      req.user_id
    )
    const checkCategory = await categoryModels.checkCategory(req.query.categoryId)

    if (checkCategory[0] === undefined) {
      MiscHelper.response(res, 'Category not found', 404)
    }

    kajianModels
      .getKajinbyOrganized(dateNow, checkOrganized[0].organized_id, active, checkCategory[0].name, limit, page)
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
    if (catId === '') {
      kajianModels
        .findKajian(latitude, longitude, search)
        .then(result => {
          if (result[0] === undefined) {
            MiscHelper.response(res, 'list kajian not found', 204)
          } else {
            MiscHelper.response(res, result, 200)
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
        kajianModels.findKajianByCat(checkCategory[0].name, latitude, longitude, search)
          .then((result) => {
            if (result[0] === undefined) {
              MiscHelper.response(res, 'list kajian not found', 204)
            } else {
              MiscHelper.response(res, result, 200)
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
      console.log(JSON.stringify(memberKajian[0].length))
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
        console.log(status)
        if (status) {
          MiscHelper.response(res, 'Kajian not found', 202)
        }
      }
    }
  },

  deleteKajianUser: async (req, res) => {
    const kajianId = await req.params.kajianId
    const checkUser = await userModels.getUser(
      req.user_id
    )
    console.log(req.user_id)
    if (checkUser[0] === undefined) {
      MiscHelper.response(res, 'User not found', 404)
    } else {
      const checkMemberKajian = await kajianModels.checkMemberKajian(kajianId, req.user_id)
      console.log(JSON.stringify(checkMemberKajian))
      if (checkMemberKajian[0] === undefined) {
        MiscHelper.response(res, 'Kajian not found', 202)
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
        detailKajian.title = kajian.title
        detailKajian.photoKajian = kajian.image
        detailKajian.linkKajian = kajian.linkVideo
        const testDate = dateFormat(kajian.startDate, 'ddd, mmmm, dd, yyyy')
        const testDateEnd = dateFormat(kajian.endDate, 'ddd, mmmm, dd, yyyy')
        const dateStart = testDate.split(',')
        const dateEnd = testDateEnd.split(',')
        if (testDate === testDateEnd) {
          detailKajian.date = dateStart[2] + dateStart[1] + dateStart[3]
        } else if (dateStart[1] === dateEnd[1]) {
          detailKajian.date = dateStart[2] + '-' + dateEnd[2] + dateStart[1] + dateStart[3]
        } else if (dateStart[1] !== dateEnd[1]) {
          detailKajian.date = dateStart[2] + '-' + dateEnd[2] + dateStart[1] + '-' + dateEnd[1] + dateStart[3]
        } else if (dateStart[3] === dateEnd[3]) {
          detailKajian.date = dateStart[2] + '-' + dateEnd[2] + dateStart[1] + dateStart[3]
        } else if (dateStart[3] !== dateEnd[3]) {
          detailKajian.date = dateStart[2] + '-' + dateEnd[2] + dateStart[1] + dateStart[3] + '-' + dateEnd[3]
        }

        const timeStart = kajian.timeStart.split(':')
        const timeEnd = kajian.timeEnd.split(':')
        detailKajian.time = timeStart[0] + ':' + timeStart[1] + ' - ' + timeEnd[0] + ':' + timeEnd[1]
        detailKajian.description = kajian.description
        detailKajian.location = kajian.locationMap
        detailKajian.latitude = kajian.latitude
        detailKajian.longitude = kajian.longitude
        if (memberKajian[0] === '') {
          listMember.push('Nothing Member here')
        } else {
          listMember.push(memberKajian[0])
        }
        detailKajian.attended = listMember
        detailKajian.countAttended = memberKajian[1]
        if (listUstadz[0] === '') {
          listUstadzs.push('nothing Ustadz here')
        } else {
          listUstadzs.push(listUstadz)
        }
        detailKajian.ustadz = listUstadzs
        detailEvent.push(detailKajian)
        MiscHelper.response(res, detailEvent, 200, 'Get Detail Kajian Success')
      }
    }
  }
}
