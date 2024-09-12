import { Router } from "express";
import multer from "multer";
import { getSubscribers, getSingleSubscriber, createSubscriber, updateSubscriber, deleteSubscriber, getSubscribersBySegment, getAllAppSubscribers, uploadSubscribersByCSV, searchSubscriber } from "../controllers/subscriber.js";
import { adminAuthJWT, userAuthJWT } from '../middlewares/auth.js';
import { validateSubscriberCreation, validateSubscriberUpdate } from "../middlewares/subscriberValidation.js";


const upload = multer({ dest: 'uploads/' });


const router: Router = Router();

router.get("/", userAuthJWT, getSubscribers);

router.get("/all", userAuthJWT, getAllAppSubscribers);

router.get("/segment/:segmentId", userAuthJWT, getSubscribersBySegment);

router.get("/search", userAuthJWT, searchSubscriber);

router.get("/:id", userAuthJWT, getSingleSubscriber);

router.post("/", userAuthJWT, validateSubscriberCreation, createSubscriber);

router.put("/:id", userAuthJWT, validateSubscriberUpdate, updateSubscriber);

router.delete("/:id", userAuthJWT, deleteSubscriber);

router.post("/file", userAuthJWT, upload.single('file'), uploadSubscribersByCSV);

export default router;