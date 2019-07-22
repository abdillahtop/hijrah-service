const connection = require('../configs/db')

module.exports = {
  getUsers: (callback) => {
    connection.query(`SELECT * FROM user`, (err, result) => {
      if (err) console.log(err)

      callback(err, result)
    })
  },

  userDetail: (userid) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM user WHERE id = ?', userid, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  register: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO user SET ?', data, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  },

  getByEmail: (email) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT userid, email, fullname, created_at, updated_at, salt, password FROM user WHERE email = ?', email, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  }
}
