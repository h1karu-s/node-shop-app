const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const confirmedEmail = (email) => {
  return sgMail.send({
    to:email,
    from:'polaris.2.71828@gmail.com',
    subject:'Signup succeeded!',
    html:'<h1>You successfully signed up!</h1>'
  })
}

const resetEmail = (email,token) => {
  return sgMail.send({
    to:email,
    from:'polaris.2.71828@gmail.com',
    subject:'Password reset',
    html:`<p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
  })
}

module.exports = {
  confirmedEmail,
  resetEmail
}