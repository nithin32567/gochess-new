import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.USER_EMAIL,
//     pass: process.env.GOOGLE_APP_PASSWORD,
//   },
// });

// const sendMail = async ({ to, subject, text }) => {
//   await transporter.sendMail({
//     from: "exam.synnefo@gmail.com",
//     to,
//     subject,
//     text,
//   });
// };

// export default sendMail;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL || "nithinprathapan32567@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD || "vomj uzmb shpr khra",
  },
});

const sendMail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.USER_EMAIL || "nithinprathapan32567@gmail.com",
      to: to,
      subject: subject,
      text: text, // plain‑text body
      html: html, // HTML body
    });

    console.log("Message sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

export default sendMail;
