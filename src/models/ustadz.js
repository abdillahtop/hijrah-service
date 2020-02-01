const connection = require('../configs/database/mysql/db')

module.exports = {
  addUstadz: (data, kajianId) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO ustadz SET ?', data, (err, result) => {
        if (!err) {
          resolve(result)
          connection.query('UPDATE kajian SET isUstadz = 1 WHERE kajian_id = ?', kajianId, (err1, result1) => {
            if (!err1) {
              resolve(result1)
            } else {
              reject(err1)
            }
          })
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  deleteUstadz: (ustadzId, kajianId) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM ustadz WHERE ustadz_id = ? AND kajian_id = ?', [ustadzId, kajianId], (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  getUstadzByKajian: (kajianId) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT ustadz.ustadz_id, ustadz.ustadz_name, ustadz.image FROM ustadz JOIN kajian ON ustadz.kajian_id = kajian.kajian_id WHERE kajian.kajian_id = ?', kajianId, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  }
}
