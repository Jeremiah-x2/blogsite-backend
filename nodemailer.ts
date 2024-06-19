import { createTransport } from "nodemailer";

const transport = createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "jamarcus37@ethereal.email",
    pass: "TXCZR5b9qjNpUf8Nte",
  },
});

async function main() {
  // send mail with defined transport object
  const info = await transport.sendMail({
    from: "jeremiahhussain904@gmail.com", // sender address
    to: "olen.pfeffer35@ethereal.email", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);
