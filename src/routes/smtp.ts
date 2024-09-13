import { Router } from "express";
import { createSmtp, getAllSmtps, getSingleSmtp, updateSmtp, deleteSmtp, getUserSmtps } from "../controllers/smtp.js";
import { validateSmtpAddition, validateSmtpUpdate } from '../middlewares/smtpValidation.js';
import { adminAuthJWT, userAuthJWT } from '../middlewares/auth.js';

const router: Router = Router();

router.post("/", userAuthJWT, validateSmtpAddition, createSmtp);

router.get("/", adminAuthJWT, getAllSmtps);

router.get("/user", userAuthJWT, getUserSmtps);

router.get('/:id', getSingleSmtp);

router.put("/:id", validateSmtpUpdate, updateSmtp);

router.delete("/:id", deleteSmtp);


export default router;