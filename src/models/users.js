const connection = require('../configs/database/mysql/db')

module.exports = {
  getUsers: (callback) => {
    connection.query(`SELECT * FROM users`, (err, result) => {
      if (err) console.log(err)

      callback(err, result)
    })
  },

  userDetail: (userid) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE user_id = ?', userid, (err, result) => {
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
      connection.query('INSERT INTO users SET ?', data, (err, result) => {
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
      connection.query('SELECT * FROM users WHERE email = ?', email, async (err, result) => {
        if (!err) {
          await resolve(result)
        } else {
          await reject(new Error(err))
        }
      })
    })
  },

  updateToken: (token, email) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET token = ? WHERE email = ?', [token, email], (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  activationUser: (email, token) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET activation = 1 WHERE email = ? AND token= ?',[email, token], (err, result) => {
        if(!err){
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  }
}
