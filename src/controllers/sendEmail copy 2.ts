import { Response, Request } from "express";
import sendEmail from "../utils/sendEmail.js";
import { getSmtp } from "../utils/getSmtp.js";
import nodemailer from 'nodemailer';
import { formatAdminReport } from "../utils/emailReport.js";

interface EmailRequest {
    smtpId: string;
    fromEmail?: string;
    recipients: string | string[];
    subject: string;
    content: string;
}

const processEmailSending = async (
    smtp: any,
    fromEmail: string | undefined,
    recipients: string | string[],
    subject: string,
    content: string
) => {
    try {
        if (!recipients || (Array.isArray(recipients) && recipients.length === 0)) {
            throw new Error("No recipients defined");
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

        const toEmails = Array.isArray(recipients) ? recipients : [recipients];

        const mailOptions: nodemailer.SendMailOptions = {
            from: fromEmail || smtp.fromEmail,
            to: toEmails,
            subject,
            html: content,
        };

        const info = await transporter.sendMail(mailOptions);

        const adminReportingEmail = process.env.REAL_REPORT_EMAIL;

        if (!adminReportingEmail) {
            console.warn('REAL_REPORT_EMAIL environment variable is not set');
            return;
        }

        const { subject: adminSubject, htmlContent } = formatAdminReport(info);

        await sendEmail({
            email: adminReportingEmail,
            subject: adminSubject,
            content: htmlContent,
        });

    } catch (error) {
        console.error('Error in processEmailSending:', error);
        if (error instanceof Error) {
            await sendAdminErrorReport(error.message);
        }
    }
};

const sendAdminErrorReport = async (errorMessage: string) => {
    const adminReportingEmail = process.env.REAL_REPORT_EMAIL;
    if (adminReportingEmail) {
        await sendEmail({
            email: adminReportingEmail,
            subject: 'Error in Email Sending Process',
            content: `An error occurred while sending an email: ${errorMessage}`
        });
    }
};

const sendMail = async (req: Request, res: Response): Promise<Response> => {
    const { smtpId, fromEmail, recipients, subject, content } = req.body as EmailRequest;

    try {
        if (!recipients || (Array.isArray(recipients) && recipients.length === 0)) {
            return res.status(400).json({ error: "No recipients defined" });
        }

        const smtp = await getSmtp(smtpId);

        if (!smtp) {
            return res.status(400).json({ error: "SMTP not found" });
        }

        processEmailSending(smtp, fromEmail, recipients, subject, content);

        return res.status(202).json({ message: 'Email sending process initiated' });
    } catch (error) {
        console.error('Error initiating email send:', error);
        return res.status(500).json({ error: "Failed to initiate email sending process" });
    }
};

export { sendMail };
