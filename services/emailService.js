import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})


transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

const sendInvitationEmail = async (to, eventName, rsvpLink) => {
  // Validate inputs
  if (!process.env.EMAIL_USER) {
    throw new Error('EMAIL_USER environment variable not set');
  }
  
  if (!process.env.EMAIL_PASS) {
    throw new Error('EMAIL_PASS environment variable not set');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'You are invited to an event!',
    html: `<p>You have been invited to ${eventName}. Please click <a href="${rsvpLink}">here</a> to RSVP.</p>`,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.response)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error 
  }
}

export default { sendInvitationEmail }