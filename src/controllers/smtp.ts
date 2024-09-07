import { Request, Response } from "express";
import Smtp from "../models/smtp.js";
import { encrypt, decrypt } from "../utils/encryption.js";

const createSmtp = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, fromEmail, service, pool, host, port, secure, auth } = req.body;

        const userId = req.userId;

        const newSmtp = new Smtp({
            name,
            fromEmail,
            service,
            pool,
            host,
            port,
            secure,
            auth,
            createdBy: userId,
        });

        await newSmtp.save();

        return res.status(201).json({ message: "SMTP configuration created successfully", smtp: newSmtp });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

const getAllSmtps = async (req: Request, res: Response): Promise<Response> => {
    try {
        const smtps = await Smtp.find();
        return res.status(200).json({ smtps });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

const getSingleSmtp = async (req: Request, res: Response): Promise<Response> => {
    try {
        const smtp = await Smtp.findById(req.params.id);

        if (!smtp) {
            return res.status(404).json({ error: "SMTP configuration not found" });
        }
        smtp.auth.pass = await decrypt(smtp.auth.pass);

        // console.log(smtp.auth.pass);


        return res.status(200).json({ smtp });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

const updateSmtp = async (req: Request, res: Response): Promise<Response> => {
    try {
        const updatedSmtp = await Smtp.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedSmtp) {
            return res.status(404).json({ error: "SMTP configuration not found" });
        }

        return res.status(200).json({ message: "SMTP configuration updated successfully", smtp: updatedSmtp });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

const deleteSmtp = async (req: Request, res: Response): Promise<Response> => {
    try {
        const deletedSmtp = await Smtp.findByIdAndDelete(req.params.id);

        if (!deletedSmtp) {
            return res.status(404).json({ error: "SMTP configuration not found" });
        }

        return res.status(200).json({ message: "SMTP configuration deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

const getUserSmtps = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId;
        const smtps = await Smtp.find({ createdBy: userId });
        return res.status(200).json({ smtps });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

export { createSmtp, getAllSmtps, getSingleSmtp, updateSmtp, deleteSmtp, getUserSmtps };
