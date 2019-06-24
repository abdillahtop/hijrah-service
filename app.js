require('dotenv').config() // Initialize dotenv config

const express = require('express') // Import express
const bodyParser = require('body-parser') // Import body-parses
const app = express() // Create method
const port = process.env.SERVER_PORT || 5000 // Default PORT

const mysql = require('mysql') // Initialize mysql
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME
}) // MySQL Config

app.listen(port, () => {
  console.log(`\n App listening on port ${port} \n`)
}) // Create listening app

app.use(bodyParser.json()) // Body parse json
app.use(bodyParser.urlencoded({ extended: false })) // body type

// Place your endpoint below
// Get all data from database
app.get('/', (req, res) => {
  res.send('Hello! this is my first endpoint!')
})

// POST data
app.post('/', (req, res) => {
  const data = {
    name: req.body.name,
    phone: req.body.phone,
    location: req.body.location,
    created_at: new Date(),
    updated_at: new Date()
  }

  conn.query('INSERT INTO user SET ?', data, (err, results) => {
    if (err) console.log(err)
    res.json(results)
  })
})

// PATCH
app.patch('/:userid', (req, res) => {
  const userid = req.params.userid

  const data = {
    name: req.body.name,
    phone: req.body.phone,
    location: req.body.location,
    updated_at: new Date()
  }

  conn.query('UPDATE user SET ? WHERE id = ?', [data, userid], (err, results) => {
    if (err) console.log(err)
    res.json(results)
  })

})

// DELETE
app.delete('/:userid', (req, res) => {
  const userid = req.params.userid

  conn.query('DELETE user WHERE id = ?', userid, (err, results) => {
    if (err) console.log(err)
    res.json(results)
  })
})
