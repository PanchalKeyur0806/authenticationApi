const nodemailer = require("nodemailer");

exports.sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 465,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  const mailoptions = {
    from: process.env.USER_EMAIL,
    to: options.email || process.env.USER_EMAIL,
    subject: options.subject,
    text: options.message,
  };

  transporter.sendMail(mailoptions, (error, info) => {
    if (error) console.log("error occured ", error);
    else console.log("email sent successfully");
  });
};
