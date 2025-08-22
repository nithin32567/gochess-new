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
    user: "synnefo.students@gmail.com",
    pass: "jyji xsjb kdof vryy",
  },
});

const sendMail = async ({ to, subject, text }) => {
  const info = await transporter.sendMail({
    from: "synnefo.students@gmail.com",
    to: to,
    subject: subject,
    text: text, // plain‑text body
    // html: "<b>Hello world?</b>", // HTML body
  });

  console.log("Message sent:", info.messageId);
};

export default sendMail;
