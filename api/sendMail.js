const nodemailer = require('nodemailer')
const path = require('path')

module.exports = {
  sendEmail: function (pathToFile, name, email, cb) {
    let typeOfDocument
    if(pathToFile === 'ProBuildersEstimate.docx'){
      typeOfDocument = 'estimate'
    } else {
      typeOfDocument = 'shopping list'
    }


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
      to: `${name} <hermano360@gmail.com>,<${email}>`,
      subject: `Probuilders Estimate`,
      text: ``,
      html: `<p>Hello ${name},</p>
      <div>Your ${typeOfDocument} is attached</div>
        <br/>
        <div>Regards,</div>
        <div>ProBuilders Express</div>
        <br/>
        <br/>
        <br/>`,
      attachments: [{
        path: path.resolve(__dirname, pathToFile),
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

      }]
    }

    console.log('Sending Mail')
    transporter.sendMail(message, (error, info) => {
      if (error) {
        cb({'status': error})
        return
      }
      cb({'status': 'successful, partner'})
      console.log('message sent successfully!')
      transporter.close()
    })
  }
}
