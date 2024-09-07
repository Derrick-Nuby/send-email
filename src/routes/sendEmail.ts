import { Router } from "express";
import { sendMail } from "../controllers/sendEmail.js";
import { adminAuthJWT } from '../middlewares/auth.js';

const router: Router = Router();

router.post("/send", sendMail);

export default router;
