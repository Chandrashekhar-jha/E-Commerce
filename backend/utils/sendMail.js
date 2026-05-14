const nodeMailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try{
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
}