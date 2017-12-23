const nodemailer = require('nodemailer')

module.exports = {
  sendEmail: function (pathToPdf, name, email, cb) {
    console.log('send email')
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'hermano360@gmail.com',
        pass: 'opportunity1'
      }
    }, {
      from: 'ProBuilders Express <hermano360@gmail.com>'
    })

    console.log('SMTP Configured')
    let message = {
      to: `${name} <hermano360@gmail.com>,${email}`,
      subject: `Probuilders Estimate`,
      text: ``,
      html: `<p>Hello</p>
      <div>Your pdf file is attached</div>
        <br/>
        <div>Regards,</div>
        <div>ProBuilders Express</div>`,
      attachments: [{
        path: pathToPdf,
        contentType: 'application/pdf'

      }]
    }

    console.log('Sending Mail')
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log(error.message)
        return
      }
      cb({'status': 'successful, partner'})
      console.log('message sent successfully!')
      transporter.close()
    })
  }
}
