require('dotenv').config() // Initialize dotenv config

module.exports = {
  baseUrl: process.env.BASE_URL,
  defaultProfile: process.env.PROFILE_DEFAULT,
  defaultKajian: process.env.KAJIAN_DEFAULT,
  logoHIjrah: process.env.LOGO_HIJRAH
}
