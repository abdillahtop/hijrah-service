const connection = require('../configs/db')

module.exports = {
  getUsers: (callback) => {
    connection.query(`SELECT * FROM user`, (err, result) => {
      if (err) console.log(err)

      callback(err, result)
    })
  },

  userDetail: (userid, callback) => {
    connection.query('SELECT * FROM user WHERE id = ?', userid, (err, result) => {
      if (err) console.log(err)

      callback(err, result)
    })
  }
}