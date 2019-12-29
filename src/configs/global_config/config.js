require('dotenv').config() // Initialize dotenv config

module.exports = {
  baseUrl: process.env.BASE_URL,
  defaultProfile: process.env.ProfileDefault
}
