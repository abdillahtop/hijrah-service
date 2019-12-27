const connection = require('../configs/database/mysql/db')
module.exports = {
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
  }
}
