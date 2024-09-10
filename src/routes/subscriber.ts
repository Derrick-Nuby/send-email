import { Router } from "express";
import { getSubscribers, getSingleSubscriber, createSubscriber, updateSubscriber, deleteSubscriber } from "../controllers/subscriber.js";
import { adminAuthJWT, userAuthJWT } from '../middlewares/auth.js';

const router: Router = Router();

router.get("/", userAuthJWT, getSubscribers);

router.get("/:id", userAuthJWT, getSingleSubscriber);

router.post("/", userAuthJWT, createSubscriber);

router.put("/:id", userAuthJWT, updateSubscriber);

router.delete("/:id", userAuthJWT, deleteSubscriber);


export default router;