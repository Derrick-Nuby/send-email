import { Router } from "express";
import { getSegments, getSingleSegment, getAllAppSegments, createSegment, updateSegment, deleteSegement } from "../controllers/segment.js";
import { adminAuthJWT, userAuthJWT } from '../middlewares/auth.js';
import { validateSegmentCreation, validateSegmentUpdate } from "../middlewares/segmentValidation.js";

const router: Router = Router();

router.get("/all", adminAuthJWT, getAllAppSegments);

router.get("/", userAuthJWT, getSegments);

router.get("/:id", userAuthJWT, getSingleSegment);

router.post("/", userAuthJWT, validateSegmentCreation, createSegment);

router.put("/:id", userAuthJWT, validateSegmentUpdate, updateSegment);

router.delete("/:id", userAuthJWT, deleteSegement);


export default router;