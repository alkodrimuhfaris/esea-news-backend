const sendMail = require('nodemailer')

module.exports = {
  sendReset: (name, email, resetcode) => {
    const connection = sendMail.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      ignoreTLS: false,
      secure: false,
      auth: {
        user: 'eseamailer@gmail.com',
        pass: 'esea123esea'
      }
    })

    const options = {
      from: 'teamtukuofficial@gmail.com',
      to: email,
      subject: 'Here Your Password Reset',
      html: `<h1>Hello ${name} this is your reset code</h1>
                   <h4>${resetcode}</h4>
                   <p>Did you request to reset your password?</p>
                   <p>Ignore it if you dont request it, maybe you can try to change your password if you fill
                   something suspicious activity in your account</p>`
    }

    return new Promise((resolve, reject) => {
      connection.sendMail(options, (error, info) => {
        if (error) {
          reject(error)
        } else {
          resolve(info)
        }
      })
    })
  },
  verifyEmail: (name, email, resetcode) => {
    const connection = sendMail.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      ignoreTLS: false,
      secure: false,
      auth: {
        user: 'eseamailer@gmail.com',
        pass: 'esea123esea'
      }
    })

    const options = {
      from: 'teamtukuofficial@gmail.com',
      to: email,
      subject: 'Here Your Password Reset',
      html: `<h1>Hello ${name} this is your email verification code</h1>
                   <h4>${resetcode}</h4>
                   <p>use this code to verify your email address, keep subscribes our news!</p>
                   <h4>eSea easy!</h4>`
    }

    return new Promise((resolve, reject) => {
      connection.sendMail(options, (error, info) => {
        if (error) {
          reject(error)
        } else {
          resolve(info)
        }
      })
    })
  }
}
