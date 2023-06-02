import nodemailer from "nodemailer";

export const postMail = async (
  sendTo: string, title: string, textBody: string, htmlBody: string,
  isTest: boolean = true,
): Promise<void> => {

  if (isTest) { // TEST Email
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });


    let info = await transporter.sendMail({
      from: '"Seongheon Lee ✈️" <skynspace@naver.com>', // sender address
      to: `${sendTo}`, // list of receivers
      subject: `[PHOTO-FOLIO] ${title}`, // Subject line
      text: `${textBody}`, // plain text body
      html: `${htmlBody}`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  }
  else { //Send FOR REAL
    let transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NAVER_ID,
        pass: process.env.NAVER_PASS
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Seongheon Lee ✈️" <skynspace@naver.com>', // sender address
      to: `${sendTo}`, // list of receivers
      subject: `[OTP] ${title}`, // Subject line
      text: `${textBody}`, // plain text body
      html: `${htmlBody}`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
};