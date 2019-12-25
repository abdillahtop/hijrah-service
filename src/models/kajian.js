const connection = require('../configs/database/mysql/db');

module.exports = {
    addKajian: (data) => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO kajian SET ?', data, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    checkCategory: (categoryId) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT category_id as id, name FROM category_kajian WHERE category_id = ?', categoryId, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    checkCategoryName: (categoryName) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT category_id as id, name FROM category_kajian WHERE name = ?', categoryName, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    checkRegencies: (regenciesId) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM regencies WHERE id = ?', regenciesId, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    checkKajian: (kajianId) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM kajian WHERE kajian_id = ?', kajianId, async (err, result) => {
                if (!err) {
                    await resolve(result)
                } else {
                    await reject(new Error(err))
                }
            })
        })
    },

    getKajianAll: (dateNow, limit, page) => {
        let offset = (limit * page) - limit
        return new Promise((resolve, reject) => {
            connection.query('UPDATE kajian SET active = ? WHERE endDate <= ?', [0, dateNow], async (err1, result1) => {
                if (!err1) {
                   await connection.query('SELECT count(*) as total from kajian', async (err2, result2) => {
                        if (!err2) {
                            let totalData = result2[0].total
                            let totalPage = Math.ceil(totalData / limit)
                            await connection.query('SELECT * FROM kajian ORDER BY title asc LIMIT ? OFFSET ?', [limit, offset], (err3, results) => {
                                if (!err3) {
                                    resolve([results, totalData, totalPage])
                                } else {
                                    reject(new Error(err3))
                                }
                            })
                        } else {
                            reject(new Error(err2))
                        }
                    })
                } else {
                    reject(new Error(err1))
                }
            })
        })
    },

    getKajianAllbyCategory: (dateNow, categoryName, limit, page) => {
        let offset = (limit * page) - limit
        return new Promise((resolve, reject) => {
            connection.query('UPDATE kajian SET active = ? WHERE endDate <= ?', [0, dateNow], async (err1, result1) => {
                if (!err1) {
                   await connection.query('SELECT count(*) as total FROM kajian WHERE categoryName = ?',categoryName, async (err2, result2) => {
                        if (!err2) {
                            let totalData = result2[0].total
                            let totalPage = Math.ceil(totalData / limit)
                            await connection.query('SELECT * FROM kajian WHERE categoryName = ? ORDER BY title asc LIMIT ? OFFSET ?', [categoryName, limit, offset], (err3, results) => {
                                if (!err3) {
                                    resolve([results, totalData, totalPage])
                                } else {
                                    reject(new Error(err3))
                                }
                            })
                        } else {
                            reject(new Error(err2))
                        }
                    })
                } else {
                    reject(new Error(err1))
                }
            })
        })
    },

    updateKajian: (data, eventId) => {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE ? FROM kajian WHERE event_id = ?', [data, eventId], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    addMemberKajian: (data) => {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO member_kajian SET ?', data, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    memberKajianAll: (kajianId, limit, page) => {
        let offset = (limit * page) - limit
        return new Promise((resolve, reject) => {
            connection.query('SELECT count(*) as total from member_kajian WHERE member_kajian.kajian_id = ?', kajianId, (err, result) => {
                if (!err) {
                    let totalData = result[0].total
                    let totalPage = Math.ceil(totalData / limit)
                    connection.query('SELECT users.name, users.profile_url FROM users JOIN member_kajian ON users.user_id = member_kajian.user_id WHERE member_kajian.kajian_id = ? ORDER BY users.name asc LIMIT ? OFFSET ?', [kajianId, limit, offset], (error, results) => {
                        if (!error) {
                            resolve([results, totalData, totalPage])
                        } else {
                            reject(error)
                        }
                    })
                } else {
                    reject(new Error(err))
                }
            })
        })
    },

    findKajian: (search) => {
        return new Promise((resolve, reject) => {
            const find = `${search}%`
            connection.query('SELECT * FROM kajian WHERE title LIKE ? ORDER BY title asc LIMIT 30 ', find, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    }
}