import { Router } from "express";
import { sendEmailWithInput, sendEmailContained, sendPredefinedAll, fetchPredefined } from "../controllers/sendEmail.js";
import { adminAuthJWT } from '../middlewares/auth.js';

const router: Router = Router();

router.post("/send-input", adminAuthJWT, sendEmailWithInput);
router.post("/send-contained", adminAuthJWT, sendEmailContained);
router.post("/send-predefined", adminAuthJWT, sendPredefinedAll);
router.get("/fetch-predefined", adminAuthJWT, fetchPredefined);

export default router;
