require('dotenv').config() // Initialize dotenv config

const express = require('express') // Import express
const bodyParser = require('body-parser') // Import body-parses
const Cors = require('cors')
const xssFilter = require('x-xss-protection')
const logger = require('morgan')
const http = require('http')

const app = express() // Create method
const server = require('http').createServer(app)
const port = process.env.PORT || 5000 // Default PORT

const userRoute = require('./src/routes/users')
const OrganizedRoute = require('./src/routes/organized')
const kajianRoute = require('./src/routes/kajian')
const ustadzRoute = require('./src/routes/ustadz')
const whitelist = process.env.WHITELIST

const corsOptions = (req, callback) => {
  if (whitelist.split(',').indexOf(req.header('Origin')) !== -1) {
    console.log('Success')
    return callback(null, {
      origin: true
    })
  } else {
    console.log('Failed')
    return callback(null, {
      origin: false
    })
  }
}

// app.use(Cors())
// app.options('*', Cors(corsOptions))
app.use(xssFilter())
app.use(logger('dev'))

app.listen(port, () => {
  console.log(`\n App listening on port ${port} \n`)
}) 

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

app.use('/api/v1/user', userRoute)
app.use('/api/v1/organized', OrganizedRoute)
app.use('/api/v1/kajian', kajianRoute)
app.use('/api/v1/ustadz', ustadzRoute)

process.on('uncaughtException', (err) => {
  console.error(new Date() + ' uncaughtException: ', err.message)
  console.error(err.stack)
  process.exit(1)
})

process.on('SIGINT', () => {
  process.exit(1)
})

module.exports.server = http.createServer(app)
