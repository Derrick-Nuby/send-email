import { Router } from "express";
import { createSmtp, getAllSmtps, getSingleSmtp, updateSmtp, deleteSmtp, getUserSmtps, sendSmtpVerification, verifySmtp } from "../controllers/smtp.js";
import { validateSmtpAddition, validateSmtpUpdate } from '../middlewares/smtpValidation.js';
import { adminAuthJWT, userAuthJWT } from '../middlewares/auth.js';

const router: Router = Router();

router.post("/", userAuthJWT, validateSmtpAddition, createSmtp);

router.get("/", adminAuthJWT, getAllSmtps);

router.get("/user", userAuthJWT, getUserSmtps);

router.post('/sendVerification', userAuthJWT, sendSmtpVerification);

router.get('/verify/:token', userAuthJWT, verifySmtp);

router.get('/:id', userAuthJWT, getSingleSmtp);

router.put("/:id", validateSmtpUpdate, userAuthJWT, updateSmtp);

router.delete("/:id", userAuthJWT, deleteSmtp);


export default router;