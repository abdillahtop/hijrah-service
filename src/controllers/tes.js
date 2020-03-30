const mongo = require('../configs/database/mongodb/mongo')
const wrapper = require('../helpers/helpers')

module.exports = {
  tesInsert: (req, res) => {
    const data = {
      name: req.body.name,
      age: req.body.age
    }

    mongo.insertOne('testing')

    // if (insertData.err) {
    //   wrapper.response(res, 'Bad error', 400)
    // }
    // wrapper.response(res, 'Insert success', 200)
  }
}
