import { Router } from "express";
import { sendMail, sendToPredefinedUsers } from "../controllers/sendEmail.js";
import { adminAuthJWT, userAuthJWT } from '../middlewares/auth.js';

const router: Router = Router();

router.post("/send", userAuthJWT, sendMail);

router.post("/predefined", userAuthJWT, sendToPredefinedUsers);


export default router;
