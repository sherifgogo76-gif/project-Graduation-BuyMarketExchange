import nodemailer, { type Transporter } from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

export const sendemail = async (data: Mail.Options): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"ROUTE ACADEMY" <${process.env.APP_EMAIL}>`,
    ...data,
  });

  console.log("Message sent: %s", info.messageId);
};


// import nodemailer, { type Transporter } from "nodemailer";
// import type Mail from "nodemailer/lib/mailer";

// export const sendemail = async (data: Mail.Options): Promise<void> => {

//   const transporter: Transporter = nodemailer.createTransport({

//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,

//     auth: {
//       user: process.env.APP_EMAIL,
//       pass: process.env.APP_PASSWORD,
//     },

//     connectionTimeout: 10000,
//     greetingTimeout: 10000,
//     socketTimeout: 10000,
//   });

//   const info = await transporter.sendMail({
//     from: `"ROUTE ACADEMY" <${process.env.APP_EMAIL}>`,
//     ...data,
//   });

//   console.log("✅ Message sent:", info.messageId);
// };
