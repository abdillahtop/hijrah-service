const organizedModels = require('../models/organized');
const MiscHelper = require('../helpers/helpers');
const uuidv4 = require('uuid/v4');
const dateFormat = require('dateformat');
const validate = require('validate.js')

module.exports = {
    getIndex: (req, res) => {
        return res.json({ code: 200, message: 'Server Running well, ready to use' })
    },

    register: async (req, res) => {
        const checkOrganized = await organizedModels.getOrganizer(req.body.userid)

        if (checkOrganized[0] == undefined) {
            const checkUser = await organizedModels.getUser(req.body.userid)

            if (checkUser[0] == undefined) {
                MiscHelper.response(res, 'User not found', 404)
            } else {
                const data = {
                    organized_id: uuidv4(),
                    user_id: req.body.userid,
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
                organizedModels.registerOrganizer(data)
                    .then(() => {
                        MiscHelper.response(res, 'Organized has been register', 200)
                    })
                    .catch((error) => {
                        MiscHelper.response(res, error, 404)
                        console.log("error " + error);
                    })
            }
        } else {
            MiscHelper.response(res, 'Organized has been used', 404)
        }
    }
}
