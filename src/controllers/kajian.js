const kajianModels = require('../models/kajian');
const organizedModels = require('../models/organized');
const userModels = require('../models/users')
const MiscHelper = require('../helpers/helpers');
const uuidv4 = require('uuid/v4');
const dateFormat = require('dateformat');

module.exports = {
    getIndex: (req, res) => {
        return res.json({ code: 200, message: 'Server Running well, ready to use' })
    },

    addKajian: async (req, res, next) => {
        const checkOrganized = await organizedModels.getOrganizedById(req.body.organizedId)
        const checkCategory = await kajianModels.checkCategory(req.body.categoryId)

        if (checkCategory[0] == undefined) {
            MiscHelper.response(res, 'Category not found', 404)
            next();
        }
        if (checkOrganized[0] == undefined) {
            MiscHelper.response(res, 'Organized not found', 404)
        } else {
            const data = {
                kajian_id: uuidv4(),
                adminKajianId: req.body.organizedId,
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
                image: 'default'
            }
            kajianModels.addKajian(data)
                .then(() => {
                    MiscHelper.response(res, 'Kajian has been Insert', 200)
                })
                .catch((error) => {
                    MiscHelper.response(res, 'Bad request', 404)
                    console.log("erronya " + error)
                })
        }
    },

    getAllKajian: async (req, res) => {
        let limit = await parseInt(req.query.limit)
        let page = await parseInt(req.query.page)
        let dateNow = await dateFormat(new Date().toLocaleString(), 'isoDateTime')
        kajianModels.getKajianAll(dateNow, limit, page)
            .then((result) => {
                console.log("result " + JSON.stringify(result))
                MiscHelper.resPagination(res, result[0], 200, result[1], result[2])
            })
            .catch((error) => {
                MiscHelper.response(res, 'Bad Request', 404)
                console.log('errornya ' + error)
            })
    },

    getAllKajianByCategory: async (req, res) => {
        let checkCategory = await kajianModels.checkCategory(req.query.categoryId)
        let limit = await parseInt(req.query.limit)
        let page = await parseInt(req.query.page)
        let dateNow = await dateFormat(new Date().toLocaleString(), 'isoDateTime')

        if (checkCategory[0] == undefined) {
            MiscHelper.response(res, 'Category not found', 404)
        } else {
            kajianModels.getKajianAllbyCategory(dateNow,checkCategory[0].name, limit, page)
                .then((result) => {
                    MiscHelper.resPagination(res, result[0], 200, result[1], result[2])
                })
                .catch((error) => {
                    MiscHelper.response(res, 'Bad Request', 404)
                    console.log('errornya ' + error)
                })
        }
    },

    addMemberKajian: async (req, res) => {
        const checkKajian = await kajianModels.checkKajian(req.body.kajianId)
        const checkUser = await userModels.userDetail(req.body.userId)

        if (checkKajian[0] == undefined) {
            MiscHelper.response(res, 'Kajian not found', 404)
            next()
        }

        if (checkUser[0] == undefined) {
            MiscHelper.response(res, 'User not found', 404)
        } else {
            const data = {
                registration_id: uuidv4(),
                user_id: req.body.userId,
                kajian_id: req.body.kajianId,
                register_at: dateFormat(new Date().toLocaleString(), 'isoDateTime')
            }
            kajianModels.addMemberKajian(data)
                .then(() => {
                    MiscHelper.response(res, 'Member Kajian has been successfull', 200)
                })
                .catch((error) => {
                    MiscHelper.response(res, 'Bad Request', 404)
                    console.log('errornya ' + error)
                })
        }
    },

    getMemberKajianAll: async (req, res) => {
        let limit = await parseInt(req.query.limit)
        let page = await parseInt(req.query.page)
        let kajianId = await req.query.kajianId
        kajianModels.memberKajianAll(kajianId, limit, page)
            .then((result) => {
                console.log("tes " + JSON.stringify(result))
                MiscHelper.resPagination(res, result[0], 200, result[1], result[2])
            })
            .catch((error) => {
                MiscHelper.response(res, 'Bad Request', 404)
                console.log('errornya ' + error)
            })
    },

    findKajian: async (req, res) => {
        let search = await req.query.search
        console.log('Search ' + search)
        kajianModels.findKajian(search)
            .then((result) => {
                MiscHelper.response(res, result, 200)
            })
            .catch((error) => {
                MiscHelper.response(res, 'Bad Request', 404)
                console.log('errornya ' + error)
            })
    }
}
