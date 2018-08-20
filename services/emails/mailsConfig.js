'use strict';
const nodemailer = require('nodemailer');

var config = {
    user : 'noohwicc@atreva.mx',
    pwd : 'Atreva17@',
    port : 465,
    host : 'smtp.zoho.com',
    from : '"CrediWhere"<noohwicc@atreva.mx>'
  };


var sendMail = (to, temp, subject ) => {

    let transporter = nodemailer.createTransport({
      host: config.host,
      secure: true,
      port: config.port,
      auth: {
          user: config.user,
          pass: config.pwd
      },
      tls: {
          // do not fail on invalid certs
          rejectUnauthorized:  false//"TLSv1_method"
      }
    });


      let mailOptions = {
          from: config.from,
          to: to,
          subject: subject,
          //text: 'Hello world?',
          html: temp
      };

      transporter.sendMail(mailOptions,  (error, info) => {
          if (error) {
              return console.log(error);
          }
          //console.log('Message sent: ' + info.response);

          //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      });

};

module.exports = {
  sendMail
};
