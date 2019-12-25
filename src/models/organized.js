const connection = require('../configs/database/mysql/db')

module.exports = {
    registerOrganizer: (data) => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO organized SET ?', data, async (err, result) => {
                if (!err) {
                    connection.query(`UPDATE users SET isOrganized = true  WHERE email = ?`, [data.email])
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
                if(!err) {
                    await resolve(result)
                } else {
                    await reject( console.log("error "+err))
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

    activationOrganized: (userid, token) => {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE organized SET activation = 1 WHERE organized_id = ? AND token= ?', [userid, token], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    }
}
