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

  getOrganizerbyEmail: (email) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM organized WHERE email = ? ', email, async (err, result) => {
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

  listOrganized: (limit, page) => {
    const offset = (limit * page) - limit
    return new Promise((resolve, reject) => {
      connection.query('SELECT count(*) as total FROM organized', async (err, result) => {
        if (!err) {
          const totalData = result[0].total
          const totalPage = Math.ceil(totalData / limit)
          await connection.query('SELECT organized_id, user_id, name_organized, email, profile_url,phone_number, address, management, created_at, activation FROM organized ORDER BY created_at desc LIMIT ? OFFSET ?', [limit, offset], (err2, results) => {
            if (!err2) {
              resolve([results, totalData, page, totalPage])
            } else {
              reject(new Error(err2))
            }
          })
        } else {
          reject(new Error(err))
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

  updateOrganized: (data, userId) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE organized SET ? WHERE user_id = ?', [data, userId], (err, result) => {
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
