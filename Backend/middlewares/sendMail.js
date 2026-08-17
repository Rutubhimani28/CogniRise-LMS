import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (email, link) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vaibhav.specscale@gmail.com",
      pass: "btwtfowownkmtdvt",
    },
  });

  // send mail with defined transport object
  var mailOptions = {
    from: "vaibhav.specscale@gmail.com",
    to: `${email}`,
    subject: "Test Mail Send",
    // text: "Hello world?",
    html: `<a href=${link}>${link}</a>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
