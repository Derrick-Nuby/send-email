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
    batchLimit?: number;  // Optional limit of emails per batch
    batchInterval?: number; // Optional time interval between batches in minutes
}

const sendEmailBatch = async (
    smtp: any,
    fromEmail: string | undefined,
    recipientsBatch: string[],
    subject: string,
    content: string
) => {
    try {
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

        const transporter = nodemailer.createTransport(transporterOptions);

        const mailOptions: nodemailer.SendMailOptions = {
            from: fromEmail || smtp.fromEmail,
            to: recipientsBatch,  // Send the batch of recipients
            subject,
            html: content,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Batch sent:', info);
    } catch (error) {
        console.error('Error sending email batch:', error);
    }
};

const scheduleEmails = async (
    smtp: any,
    fromEmail: string | undefined,
    recipients: string[],
    subject: string,
    content: string,
    batchLimit: number,
    batchInterval: number
) => {
    const totalEmails = recipients.length;
    let batchStart = 0;
    let batchCount = 0;

    while (batchStart < totalEmails) {
        const batch = recipients.slice(batchStart, batchStart + batchLimit);
        setTimeout(() => {
            console.log(`Sending batch ${batchCount + 1}:`, batch);
            sendEmailBatch(smtp, fromEmail, batch, subject, content);
        }, batchCount * batchInterval * 60 * 1000); // Convert minutes to milliseconds

        batchStart += batchLimit;
        batchCount++;
    }
};

const sendMail = async (req: Request, res: Response): Promise<Response> => {
    const { smtpId, fromEmail, recipients, subject, content, batchLimit = 24, batchInterval = 60 } = req.body as EmailRequest;

    try {
        if (!recipients || (Array.isArray(recipients) && recipients.length === 0)) {
            return res.status(400).json({ error: "No recipients defined" });
        }

        const smtp = await getSmtp(smtpId);

        if (!smtp) {
            return res.status(400).json({ error: "SMTP not found" });
        }

        // Schedule the emails based on the limit and interval
        scheduleEmails(smtp, fromEmail, Array.isArray(recipients) ? recipients : [recipients], subject, content, batchLimit, batchInterval);

        return res.status(202).json({ message: 'Email scheduling initiated', totalRecipients: recipients.length });
    } catch (error) {
        console.error('Error initiating email scheduling:', error);
        return res.status(500).json({ error: "Failed to initiate email scheduling" });
    }
};

export { sendMail };
