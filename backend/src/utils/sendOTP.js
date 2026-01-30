import nodemailer from "nodemailer";

let testAccountPromise = nodemailer.createTestAccount();

export const sendOTP = async (email, otp) => {
  const testAccount = await testAccountPromise;

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: "no-reply@battery-recycle.app",
    to: email,
    subject: "Verify your email",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  });

  console.log("✅ OTP EMAIL PREVIEW URL:");
  console.log(nodemailer.getTestMessageUrl(info));
};
