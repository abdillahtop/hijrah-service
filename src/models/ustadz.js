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
    },

    getUstadzByKajian: (kajianId) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT ustadz.ustadz_name, ustadz.image FROM ustadz JOIN kajian ON ustadz.kajian_id = kajian.kajian_id WHERE kajian.kajian_id = ?', kajianId, (err, result) => {
                if(!err){
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    }
}