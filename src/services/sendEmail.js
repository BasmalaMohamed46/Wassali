const nodemailer = require('nodemailer');

async function sendEmail(dest,message){


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    maxMessages: Infinity,
    maxConnections: 20,
    pool:true,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.senderEmail, // generated ethereal user
      pass: process.env.senderPassword, // generated ethereal password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: `wassaly <${process.env.senderEmail}>`, // sender address
    to: dest, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html:message, // html body
  });


}


module.exports = sendEmail;
