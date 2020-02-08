const mongoCon = require('./connection');
const validate = require('validate.js');

class DB {
  constructor(config) {
    this.config = config;
  }

  setCollection(collectionName) {
    this.collectionName = collectionName
  }

  async insertOne(document) {
    const dbName = await 
  }

}

module.exports = DB;