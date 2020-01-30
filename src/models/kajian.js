const connection = require('../configs/database/mysql/db')

module.exports = {
  addKajian: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO kajian SET ?', data, async (err, result) => {
        if (!err) {
          await resolve(result)
        } else {
          await reject(new Error(err))
        }
      })
    })
  },

  getKajianAll: (dateNow, limit, page) => {
    const offset = (limit * page) - limit
    return new Promise((resolve, reject) => {
      connection.query('UPDATE kajian SET active = ? WHERE endDate <= ?', [0, dateNow], async (err1, result1) => {
        if (!err1) {
          await connection.query('SELECT count(*) as total FROM kajian WHERE isUstadz = 1 AND active = 1', async (err2, result2) => {
            if (!err2) {
              const totalData = result2[0].total
              const totalPage = Math.ceil(totalData / limit)
              await connection.query('SELECT * FROM kajian WHERE isUstadz = 1 AND active = 1 ORDER BY startDate desc LIMIT ? OFFSET ?', [limit, offset], (err3, results) => {
                if (!err3) {
                  resolve([results, totalData, page, totalPage])
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

  getKajianAllNearby: (dateNow, latitude, longitude, limit, page) => {
    const offset = (limit * page) - limit
    return new Promise((resolve, reject) => {
      connection.query('UPDATE kajian SET active = ? WHERE endDate <= ?', [0, dateNow], async (err1, result1) => {
        if (!err1) {
          await connection.query('SELECT count(*) as total FROM kajian WHERE isUstadz = 1 AND active = 1', async (err2, result2) => {
            if (!err2) {
              const totalData = result2[0].total
              const totalPage = Math.ceil(totalData / limit)
              await connection.query('SELECT *, ( 6371 * acos( cos( radians(kajian.latitude) ) * cos( radians( ? ) ) * cos( radians( ? ) - radians(kajian.longitude) ) + sin( radians(kajian.latitude) ) * sin(radians( ? )) ) ) AS distance FROM kajian WHERE isUstadz = 1 AND active = 1 HAVING distance < 50 ORDER BY distance LIMIT ? OFFSET ?', [latitude, longitude, latitude, limit, offset], (err3, results) => {
                if (!err3) {
                  resolve([results, totalData, page, totalPage])
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

  getKajianAllPopuler: (dateNow, latitude, longitude, limit, page) => {
    const offset = (limit * page) - limit
    return new Promise((resolve, reject) => {
      connection.query('UPDATE kajian SET active = ? WHERE endDate <= ?', [0, dateNow], async (err1, result1) => {
        if (!err1) {
          await connection.query('SELECT count(*) as total FROM kajian WHERE isUstadz = 1 AND active = 1', async (err2, result2) => {
            if (!err2) {
              const totalData = result2[0].total
              const totalPage = Math.ceil(totalData / limit)
              await connection.query('SELECT *, ( 6371 * acos( cos( radians(kajian.latitude) ) * cos( radians( ? ) ) * cos( radians( ? ) - radians(kajian.longitude) ) + sin( radians(kajian.latitude) ) * sin(radians( ? )) ) ) AS distance FROM kajian WHERE isUstadz = 1 AND active = 1 HAVING distance < 50 ORDER BY count_member desc LIMIT ? OFFSET ?', [latitude, longitude, latitude, limit, offset], (err3, results) => {
                if (!err3) {
                  resolve([results, totalData, page, totalPage])
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
    const offset = (limit * page) - limit
    return new Promise((resolve, reject) => {
      connection.query('UPDATE kajian SET active = ? WHERE endDateFormat <= ?', [0, dateNow], async (err1, result1) => {
        if (!err1) {
          await connection.query('SELECT count(*) as total FROM kajian WHERE categoryName = ? AND isUstadz = 1 AND active = 1', categoryName, async (err2, result2) => {
            if (!err2) {
              const totalData = result2[0].total
              const totalPage = Math.ceil(totalData / limit)
              await connection.query('SELECT * FROM kajian WHERE isUstadz = 1 AND categoryName = ? AND active = 1 ORDER BY startDate desc LIMIT ? OFFSET ?', [categoryName, limit, offset], (err3, results) => {
                if (!err3) {
                  resolve([results, totalData, page, totalPage])
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

  updateKajian: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE ? FROM kajian WHERE kajian_id = ?', [data, data.kajianId], (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },

  addMemberKajian: (data, countMember, kajianId) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO member_kajian SET ?', data, (err, result) => {
        if (!err) {
          connection.query('UPDATE kajian SET count_member = ? WHERE kajian_id = ?', [countMember, kajianId], (err1, result1) => {
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

  memberKajianAll: (kajianId, limit, page) => {
    const offset = (limit * page) - limit
    return new Promise((resolve, reject) => {
      connection.query('SELECT count(*) as total from member_kajian WHERE member_kajian.kajian_id = ?', kajianId, (err, result) => {
        if (!err) {
          const totalData = result[0].total
          const totalPage = Math.ceil(totalData / limit)
          connection.query('SELECT users.name, users.profile_url FROM users JOIN member_kajian ON users.user_id = member_kajian.user_id WHERE member_kajian.kajian_id = ? ORDER BY users.name asc LIMIT ? OFFSET ?', [kajianId, limit, offset], (error, results) => {
            if (!error) {
              resolve([results, totalData, page, totalPage])
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

  memberKajian: (kajianId) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT count(*) as total from member_kajian WHERE member_kajian.kajian_id = ?', kajianId, (err, result) => {
        if (!err) {
          const totalData = result[0].total
          connection.query('SELECT users.name, users.profile_url FROM users JOIN member_kajian ON users.user_id = member_kajian.user_id WHERE member_kajian.kajian_id = ? ORDER BY users.name asc', kajianId, (error, results) => {
            if (!error) {
              resolve([results, totalData])
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

  findKajian: (latitude, longitude, search) => {
    return new Promise((resolve, reject) => {
      const find = `%${search}%`
      connection.query('SELECT *, ( 6371 * acos( cos( radians(kajian.latitude) ) * cos( radians( ? ) ) * cos( radians( ? ) - radians(kajian.longitude) ) + sin( radians(kajian.latitude) ) * sin(radians( ? )) ) ) AS distance FROM kajian WHERE title LIKE ? AND isUstadz = 1 AND active = 1 HAVING distance < 1000 ORDER BY distance LIMIT 20 ', [latitude, longitude, latitude, find], (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  },

  findKajianByCat: (catId, latitude, longitude, search) => {
    return new Promise((resolve, reject) => {
      const find = `${search}%`
      connection.query('SELECT *, ( 6371 * acos( cos( radians(kajian.latitude) ) * cos( radians( ? ) ) * cos( radians( ? ) - radians(kajian.longitude) ) + sin( radians(kajian.latitude) ) * sin(radians( ? )) ) ) AS distance FROM kajian WHERE title LIKE ? AND isUstadz = 1 AND categoryName = ? HAVING distance < 1000 ORDER BY distance LIMIT 20 ', [latitude, longitude, latitude, find, catId], (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
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

  checkKajianbyUserId: (userId) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM kajian WHERE adminKajianId = ?', userId, async (err, result) => {
        if (!err) {
          await resolve(result)
        } else {
          await reject(new Error(err))
        }
      })
    })
  },

  checkMemberKajian: (kajianId, userId) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM member_kajian WHERE kajian_id = ? AND user_id = ?', [kajianId, userId], async (err, result) => {
        if (!err) {
          await resolve(result)
        } else {
          await reject(new Error(err))
          console.log('ini errornya ' + err)
        }
      })
    })
  },

  getKajianByUser: (userId) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT kajian.kajian_id, kajian.title, kajian.image, kajian.categoryName, kajian.startDate, kajian.endDate, kajian.timeStart, kajian.timeEnd, kajian.location, kajian.payment FROM kajian JOIN member_kajian ON kajian.kajian_id = member_kajian.kajian_id WHERE member_kajian.user_id = ?', userId, async (err, result) => {
        if (!err) {
          await resolve(result)
        } else {
          await reject(new Error(err))
        }
      })
    })
  },

  unjoinKajian: (userId, countMember, kajianId) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM member_kajian WHERE user_id = ? AND kajian_id = ?', [userId, kajianId], async (err, result) => {
        if (!err) {
          connection.query('UPDATE kajian SET count_member = ? WHERE kajian_id = ?', [countMember, kajianId], (err1, result1) => {
            if (!err1) {
              resolve(result1)
            } else {
              reject(err1)
            }
          })
        } else {
          await reject(new Error(err))
        }
      })
    })
  },

  deleteKajian: (adminKajianId, kajianId) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM kajian WHERE adminKajianID = ? AND kajian_id = ?', [adminKajianId, kajianId], async (err, result) => {
        if (!err) {
          await resolve(result)
        } else {
          await reject(new Error(err))
        }
      })
    })
  },

  deleteKajianbyUser: (regisId) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM member_kajian WHERE registration_id = ?', regisId, async (err, result) => {
        if (!err) {
          await resolve(result)
        } else {
          await reject(new Error(err))
        }
      })
    })
  },

  getKajinbyOrganized: (dateNow, organizedId, active, categoryName, limit, page) => {
    const offset = (limit * page) - limit
    return new Promise((resolve, reject) => {
      connection.query('UPDATE kajian SET active = ? WHERE endDate <= ?', [0, dateNow], async (err1, result1) => {
        if (!err1) {
          await connection.query('SELECT count(*) as total FROM kajian WHERE isUstadz = 1 AND categoryName = ? AND adminKajianId = ?', [categoryName, organizedId], async (err2, result2) => {
            if (!err2) {
              const totalData = result2[0].total
              const totalPage = Math.ceil(totalData / limit)
              await connection.query('SELECT kajian.kajian_id, kajian.title,image, kajian.categoryName, kajian.startDate, kajian.endDate, timeStart, timeEnd, kajian.location, kajian.payment FROM kajian JOIN organized ON kajian.adminKajianId = organized.organized_id WHERE organized.organized_id = ? AND active = ? AND categoryName = ? AND isUstadz = 1 ORDER BY kajian.startDate desc LIMIT ? OFFSET ?', [organizedId, active, categoryName, limit, offset], (err3, results) => {
                if (!err3) {
                  resolve([results, totalData, page, totalPage])
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
  }
}
