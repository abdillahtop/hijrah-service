const connection = require('../configs/database/mysql/db')

module.exports = {
  getVersion: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM version', async (err, result) => {
        if (!err) {
          await resolve(result)
        } else {
          await reject(new Error(err))
        }
      })
    })
  },

  updateVersion: (version) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE version SET ?', version, async (err, result) => {
        if (!err) {
          await resolve(result)
        } else {
          await reject(new Error(err))
        }
      })
    })
  }
}
