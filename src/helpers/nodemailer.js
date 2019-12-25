var nodemailer = require('nodemailer');
module.exports = (req, res) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'roronoazum@gmail.com',
            pass: 'sewelas11'
        }
    });
    console.log(req.body)
    const mailOptions = {
        from: 'roronoazum@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: 'Transaksimu', // Subject line
        html: '<p>Transakasi Berhasil</p>'// plain text body
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err){
            console.log(err)
        }
        else{
            res.json('Sukses')
            console.log('suskses')
        }
    });
}