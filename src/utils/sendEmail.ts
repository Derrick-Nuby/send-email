import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Environment variables EMAIL_USER and EMAIL_PASSWORD must be set.');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

interface EmailOptions {
    email: string;
    subject: string;
    content: string;
}

const sendEmail = async ({ email, subject, content }: EmailOptions): Promise<void> => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: content,
    };

    try {
        const info = await transporter.sendMail(mailOptions);

        // console.log(`Email sent from ${info.envelope.from} to ${info.envelope.to}. Status: ${info.response.includes('OK') ? 'OK' : 'Not OK'}`);

    } catch (error) {
        console.error('Error sending email and saving response:', error);

        throw new Error('Failed to send email and save response');
    }
};

export default sendEmail;
