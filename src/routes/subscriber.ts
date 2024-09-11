import { Router } from "express";
import { getSubscribers, getSingleSubscriber, createSubscriber, updateSubscriber, deleteSubscriber, getSubscribersBySegment, getAllAppSubscribers, uploadSubscribersByCSV } from "../controllers/subscriber.js";
import { adminAuthJWT, userAuthJWT } from '../middlewares/auth.js';
import { validateSubscriberCreation, validateSubscriberUpdate } from "../middlewares/subscriberValidation.js";

const router: Router = Router();

router.get("/", userAuthJWT, getSubscribers);

router.get("/all", userAuthJWT, getAllAppSubscribers);

router.get("/segment/:segmentId", userAuthJWT, getSubscribersBySegment);

router.get("/:id", userAuthJWT, getSingleSubscriber);

router.post("/", userAuthJWT, validateSubscriberCreation, createSubscriber);

router.put("/:id", userAuthJWT, validateSubscriberUpdate, updateSubscriber);

router.delete("/:id", userAuthJWT, deleteSubscriber);

router.post("/file", userAuthJWT, uploadSubscribersByCSV);


export default router;