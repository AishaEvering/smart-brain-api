const utils = require("../helpers/utils");
const validator = require("validator");
const nodemailer = require("nodemailer");

const handleSendPasswordRecoveryEmail = () => (req, res) => {
  const { email, OTP } = req.body;

  if (!validator.isEmail(email) || validator.isEmpty(OTP)) {
    return utils.getFailedResponse(res, "invalid parameters");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "PASSWORD RESET",
    html: `<html>
             <body>
               <h2>Password Recovery</h2>
               <p>Log in using the following temporary password.</p>
               <h3>${OTP}</h3>
               <p>The temporary password and will expire in 1 minute.</p>
             </body>
           </html>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return utils.getFailedResponse(
        res,
        "An error occurred while sending the email "
      );
    }

    return utils.getSuccessResponse(res, email, "Email sent successfully");
  });
};

module.exports = {
  handleSendPasswordRecoveryEmail,
};
