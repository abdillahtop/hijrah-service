const nodemailer = require('nodemailer')
const Mischelper = require('../helpers/helpers')
const domain = require('../configs/global_config/config')

module.exports = (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rahasia@gmail.com',
      pass: 'rahasia'
    }
  })
  console.log(req.body)
  const body = 'api/v1/user/activation?email=' + req.body.email
  const mailOptions = {
    from: 'rahasia@gmail.com',
    to: req.body.email,
    subject: 'Verify Akun',
    html: 'Hello, ' + req.body.name + '<br> Please Click on the link to verify your email.<br><a href=' + domain.baseUrl / body + '>Click here to verify</a>'
  }
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err)
    } else {
      Mischelper.response(res, info, 200)
    }
  })
}
