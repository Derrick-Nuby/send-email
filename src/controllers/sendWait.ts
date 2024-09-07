import { Response, Request } from "express";
import sendEmail from "../utils/sendEmail.js";
import { getSmtp } from "../utils/getSmtp.js";
import nodemailer from 'nodemailer';
import { formatAdminReport } from "../utils/emailReport.js";

const sendMail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { smtpId, fromEmail, recepients, subject, content } = req.body;

        const smtp = await getSmtp(smtpId);

        if (!smtp) {
            return res.status(400).json({ error: "SMTP not found" });
        }

        if (fromEmail) {
            smtp.fromEmail = fromEmail;
        }

        const transporterOptions: any = {
            service: smtp.service,
            pool: smtp.pool,
            host: smtp.host,
            port: smtp.port,
            secure: smtp.secure,
            auth: {
                user: smtp.auth.user,
                pass: smtp.auth.pass,
            },
        };

        Object.keys(transporterOptions).forEach(key => {
            if (transporterOptions[key as keyof typeof transporterOptions] === undefined) {
                delete transporterOptions[key as keyof typeof transporterOptions];
            }
        });

        const transporter = nodemailer.createTransport(transporterOptions);

        const toEmails = Array.isArray(recepients) ? recepients : [recepients];

        const mailOptions: nodemailer.SendMailOptions = {
            from: smtp.fromEmail,
            to: toEmails,
            subject,
            html: content,
        };

        const info = await transporter.sendMail(mailOptions);

        const adminReportingEmail = process.env.REAL_REPORT_EMAIL;

        if (!adminReportingEmail) {
            throw new Error('ENCRYPTION_KEY environment variable is not set');
        }

        const { subject: adminSubject, htmlContent } = formatAdminReport(info);

        await sendEmail({
            email: adminReportingEmail,
            subject: adminSubject,
            content: htmlContent,
        });

        return res.status(200).json({ message: 'Email sent successfully', info });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: "Failed to send email" });
    }
};

export { sendMail };
