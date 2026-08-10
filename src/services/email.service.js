import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, html) => {

    const info = await transporter.sendMail({
        from: `"ERP System" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });

  
};


export default sendEmail;