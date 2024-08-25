import { Response, Request } from "express";
import sendEmail from "../utils/sendEmail.js";
import userEmails from "../data/userEmails.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { emailSubject, emailContent } from "../data/emailTemplates.js";


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

const sendPredefinedAll = async (req: Request, res: Response): Promise<any> => {
    try {

        const { password, confirmation } = req.body;
        const userId = req.userId;

        if (!password || typeof confirmation !== 'boolean') {
            return res.status(400).json({ error: 'Password and confirmation are required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid || !confirmation) {
            return res.status(401).json({ error: 'Invalid password or confirmation' });
        }

        const subject = 'Thank You for Your Application';

        for (const user of userEmails) {
            const content = emailContent(user.name);
            await sendEmail({ email: user.email, subject: emailSubject, content });
        }

        res.status(201).json({ message: "Emails sent to all users  who had everything predefined successfully" });
    } catch (error) {
        console.error('Error in sendPredefinedAll:', error);
        res.status(500).json({ error: "Failed to send emails to  users who had everything predefined" });
    }
};

const fetchPredefined = async (req: Request, res: Response): Promise<any> => {
    try {
        const predefinedEmails = userEmails.map(user => {
            return {
                email: user.email,
                name: user.name
            };
        });

        res.status(200).json({ predefinedEmails });
    } catch (error) {
        console.error('Error in fetchPredefined:', error);
        res.status(500).json({ error: "Failed to fetch predefined emails" });
    }
};

export { sendEmailWithInput, sendEmailContained, sendPredefinedAll, fetchPredefined };
