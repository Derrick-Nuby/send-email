import { Router } from "express";
import { sendEmailWithInput, sendEmailContained } from "../controllers/sendEmail.js";
import { adminAuthJWT } from '../middlewares/auth.js';

const router: Router = Router();

router.post("/send-input", adminAuthJWT, sendEmailWithInput);
router.post("/send-contained", adminAuthJWT, sendEmailContained);

export default router;
