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
    batchLimit?: number;
    batchInterval?: number;
}

interface BatchResult {
    accepted: string[];
    rejected: string[];
    messageId?: string;
    response?: string;
}

const sendEmailBatch = async (
    smtp: any,
    fromEmail: string | undefined,
    recipientsBatch: string[],
    subject: string,
    content: string,
    batchNumber: number
): Promise<BatchResult> => {
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
            to: recipientsBatch,
            subject,
            html: content,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`Batch ${batchNumber} sent:`, recipientsBatch);
        return {
            accepted: (info.accepted || []).map(recipient =>
                typeof recipient === 'string' ? recipient : recipient.address
            ),
            rejected: (info.rejected || []).map(recipient =>
                typeof recipient === 'string' ? recipient : recipient.address
            ),
            messageId: info.messageId,
            response: info.response
        };
    } catch (error: unknown) {
        console.error(`Error sending email batch ${batchNumber}:`, error);
        return {
            accepted: [],
            rejected: recipientsBatch,
            response: error instanceof Error ? error.message : String(error)
        };
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
): Promise<BatchResult[]> => {
    const totalEmails = recipients.length;
    let batchStart = 0;
    let batchCount = 0;
    const results: BatchResult[] = [];

    while (batchStart < totalEmails) {
        const batch = recipients.slice(batchStart, batchStart + batchLimit);
        const currentBatchNumber = batchCount + 1;

        const result = await new Promise<BatchResult>((resolve) => {
            setTimeout(async () => {
                console.log(`Sending batch ${currentBatchNumber}:`, batch);
                const batchResult = await sendEmailBatch(smtp, fromEmail, batch, subject, content, currentBatchNumber);
                resolve(batchResult);
            }, batchCount * batchInterval * 60 * 1000);
        });

        results.push(result);
        batchStart += batchLimit;
        batchCount++;
    }

    console.log(`Completed sending ${batchCount} batches of emails.`);
    return results;
};

const sendMailBackground = async (
    smtp: any,
    fromEmail: string | undefined,
    recipients: string[],
    subject: string,
    content: string,
    batchLimit: number,
    batchInterval: number
) => {
    try {
        const batchResults = await scheduleEmails(smtp, fromEmail, recipients, subject, content, batchLimit, batchInterval);

        const aggregatedResult: BatchResult = batchResults.reduce((acc, result) => ({
            accepted: [...acc.accepted, ...result.accepted],
            rejected: [...acc.rejected, ...result.rejected],
            messageId: acc.messageId || result.messageId,
            response: acc.response || result.response
        }), { accepted: [], rejected: [], messageId: '', response: '' });

        const adminReportingEmail = process.env.REAL_REPORT_EMAIL;
        if (!adminReportingEmail) {
            throw new Error('REAL_REPORT_EMAIL environment variable is not set');
        }

        const { subject: adminSubject, htmlContent } = formatAdminReport(aggregatedResult);

        await sendEmail({
            email: adminReportingEmail,
            subject: adminSubject,
            content: htmlContent,
        });

        console.log('Email sending completed and admin report sent');
    } catch (error) {
        console.error('Error in background email sending process:', error);
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

        setImmediate(() => {
            sendMailBackground(smtp, fromEmail, Array.isArray(recipients) ? recipients : [recipients], subject, content, batchLimit, batchInterval);
        });

        return res.status(202).json({
            message: 'Email sending process initiated',
            totalRecipients: Array.isArray(recipients) ? recipients.length : 1
        });
    } catch (error) {
        console.error('Error initiating email sending process:', error);
        return res.status(500).json({ error: "Failed to initiate email sending process" });
    }
};

export { sendMail };