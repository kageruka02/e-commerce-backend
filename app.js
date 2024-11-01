const nodeMailer = require('nodemailer');

const html = `
<h1>Hello world</h1>
<p>Isn't Nodemailer useful?</p>`


async function main() {
     const transporter  = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        secure: true,
        port: 465,
        auth: {
            user: "leonkageruka@gmail.com",
            pass: "nwrn ggpu wbcw vcby"

        }
     })
    
    const info = await transporter.sendMail({
        from: "Leon <leonkageruka@gmail.com>",
        to: "mugishabenjamin133@gmail.com",
        subject: "Testing, testing, 123",
        html: html,

    }) 
    console.log("Message sent: " + info.messageId);
    
}
main().catch(e => console.log(e))