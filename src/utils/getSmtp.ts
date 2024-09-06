import { decrypt } from "./encryption.js";
import Smtp from "../models/smtp.js";

export const getSmtp = async (smtpId: string) => {
    try {

        const smtp = await Smtp.findById(smtpId);

        if (!smtp) {
            throw new Error('SMTP configuration not found');
        }

        smtp.auth.pass = await decrypt(smtp.auth.pass);

        return smtp;
    } catch (error) {
        console.error(error);
        throw new Error('Server error');
    }
};