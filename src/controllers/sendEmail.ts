import { Response, Request } from "express";
import sendEmail from "../utils/sendEmail.js";
import userEmails from "../data/userEmails.js";

// Send email using user input
const sendEmailWithInput = async (req: Request, res: Response): Promise<any> => {
    try {
        const { emails, subject, content } = req.body;

        if (!emails || !subject || !content) {
            return res.status(400).json({ error: "Emails, subject, and content are required." });
        }

        for (const email of emails) {
            await sendEmail({ email, subject, content });
        }

        res.status(201).json({ message: "Emails sent successfully" });
    } catch (error) {
        console.error('Error in sendEmailWithInput:', error);
        res.status(500).json({ error: "Failed to send emails" });
    }
};

// Send email to predefined users
const sendEmailContained = async (req: Request, res: Response): Promise<any> => {
    try {
        const { subject, content } = req.body;

        if (!subject || !content) {
            return res.status(400).json({ error: "Subject and content are required." });
        }

        for (const user of userEmails) {
            await sendEmail({ email: user.email, subject, content });
        }

        res.status(201).json({ message: "Emails sent to predefined users successfully" });
    } catch (error) {
        console.error('Error in sendEmailContained:', error);
        res.status(500).json({ error: "Failed to send emails to predefined users" });
    }
};

export { sendEmailWithInput, sendEmailContained };
