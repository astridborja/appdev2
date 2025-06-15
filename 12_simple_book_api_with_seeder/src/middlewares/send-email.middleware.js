const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendBookCreatedEmail(book) {
  const templatePath = path.join(__dirname, '../../views/bookCreated.pug');
  const html = pug.renderFile(templatePath, {
    title: book.title,
    author: book.author,
    year: book.year,
  });

  const mailOptions = {
    from: `"Book API" <${process.env.SMTP_USER}>`,
    to: process.env.EMAIL_TO,
    subject: '📚 New Book Added',
    html,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendBookCreatedEmail;
