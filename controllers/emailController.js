const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) => {
    let transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_ID, //general ethereal user
            pass: process.env.MP, // generated ethereal password
        }
    })

    //send email with defined transport object
    let info = await transport.sendMail({
        from: `E-commerce <${process.env.MAIL_ID}`,
        to: data.to, //list of receivers
        subject: data.subject,// subject line
        text: data.text, // plain text body
        html: data.html, //html body

        
    })
    console.log("Message sent: %s", info.messageId);
    // Message sent 

    
})
module.exports = {sendEmail} 