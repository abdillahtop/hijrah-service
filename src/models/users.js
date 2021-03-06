const connection = require('../configs/database/mysql/db.js')

module.exports = {
  getUsers: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users', (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  userDetail: (userid) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT user_id, email, name, profile_url, phone_number, gender, activation, birth_date, created_at, role_id, verified, isOrganized, activation_code FROM users WHERE user_id = ?', userid, (err, result) => {
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

  getUser: (userId) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE user_id = ?', userId, async (err, result) => {
        if (!err) {
          await resolve(result)
        } else {
          await reject(new Error(err))
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

  activationUser: (code, email) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET activation = 1 WHERE activation_code = ? AND email = ?', [code, email], (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  sendCode: (code, email) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET activation_code = ? WHERE email = ?', [code, email], (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  validateCode: (code, email) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE activation_code = ? AND email = ?', [code, email], (err, result) => {
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
