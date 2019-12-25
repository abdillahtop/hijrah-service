const connection = require('../configs/database/mysql/db');

module.exports = {
    addUstadz: (data) => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO ustadz SET ?', data, (err, result) => {
                if(!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    deleteUstadz: (ustadzId) => {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM ustadz WHERE ustadz_id = ?', ustadzId, (err, result) => {
                if(!err){
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    }
}