const connection = require('../configs/database/mysql/db')

module.exports = {
  registerOrganizer: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO organized SET ?', data, async (err, result) => {
        if (!err) {
          connection.query('UPDATE users SET isOrganized = true  WHERE email = ?', [data.email])
          await resolve(result)
        } else {
          await reject(new Error(err))
        }
      })
    })
  },

  getOrganizer: (userid) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM organized WHERE user_id = ? ', userid, async (err, result) => {
        if (!err) {
          await resolve(result)
        } else {
          await reject(new Error(err))
        }
      })
    })
  },

  getOrganizedById: (organizedId) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM organized WHERE organized_id = ?', organizedId, async (err, result) => {
        if (!err) {
          await resolve(result)
        } else {
          await reject(console.log('error ' + err))
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

  checkOrganized: (organizedId) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM organized WHERE organized_id = ?', organizedId, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  activationOrganized: (organizedId) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE organized SET activation = 1 WHERE organized_id = ?', organizedId, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  deleteOrganized: async (organizedId, userId) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM organized WHERE organized_id = ?', organizedId, async (err, result) => {
        if (!err) {
          await connection.query('UPDATE users SET isOrganized = false  WHERE user_id = ?', userId, (err1, result1) => {
            if (!err1) {
              resolve(result1)
            } else {
              reject(err1)
            }
          })
          await connection.query('DELETE FROM kajian WHERE adminKajianId = ?', organizedId, (err2, result2) => {
            if (!err2) {
              resolve(result2)
            } else {
              reject(err2)
            }
          })
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  }
}
