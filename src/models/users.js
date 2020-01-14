const connection = require('../configs/database/mysql/db')

module.exports = {
  getUsers: (callback) => {
    connection.query('SELECT * FROM users', (err, result) => {
      if (err) console.log(err)

      callback(err, result)
    })
  },

  userDetail: (userid) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT user_id, email, name, profile_url, phone_number, gender, activation, birth_date, created_at, role_id, verified, isOrganized FROM users WHERE user_id = ?', userid, (err, result) => {
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

  activationUser: (email) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET activation = 1 WHERE email = ?', email, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  updateProfile: (data, userId) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET ? WHERE user_id = ?', [data, userId], (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  forgetPassword: (data, email) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET ? WHERE email = ?', [data, email], (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  }
}
