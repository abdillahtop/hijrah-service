require('dotenv').config() // Initialize dotenv config
const Mongo = require('mongodb').MongoClient
const url = process.env.MONGO_DATABASE_URL

const createConnection = async (config) => {
  Mongo.connect(url, (err, db) => {
    if (err) throw err
    db.createConnection(config, (err, res) => {
      if (err) throw err
      db.close()
    })
  })
}

module.exports = createConnection
