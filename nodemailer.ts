import { createTransport } from 'nodemailer';
// var smtpTransport = require('nodemailer-smtp-transport');
import SMTPTransport from 'nodemailer/lib/smtp-transport';

var transporter = createTransport(
  new SMTPTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'jeremiahhussain904@gmail.com',
      pass: 'LAMENtations904,.,.$',
    },
  })
);

var mailOptions = {
  from: 'jeremiahhussain904@gmail.com',
  to: 'jeremiahhussaini2@gmail.com',
  subject: 'Sending Email using Node.js[nodemailer]',
  text: 'That was easy!',
};

transporter.sendMail(mailOptions, function (error: any, info: any) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
