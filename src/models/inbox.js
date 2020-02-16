const connection = require('../configs/database/mysql/db')

module.exports = {
  getInboxbyUser: (userId) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM inbox WHERE user_id = ? ORDER BY created_at desc', userId, (err, res) => {
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  },

  checkInbox: (userId) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT count(*) as total FROM inbox WHERE isRead = 0 AND user_id = ?', userId, (err, res) => {
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  },

  addInbox: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO inbox SET ?', data, (err, res) => {
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  },

  isReadInbox: (userId) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE inbox SET isRead = 1 WHERE user_id = ?', userId, (err, res) => {
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  },

  deleteInbox: (userId, inboxId) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE inbox WHERE inbox_id = ? AND user_id', [inboxId, userId], (err, res) => {
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  }
}
