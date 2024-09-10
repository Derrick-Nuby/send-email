import { Router } from "express";
import { getSegments, getSingleSegment, createSegment, updateSegment, deleteSegement } from "../controllers/segment.js";
import { adminAuthJWT, userAuthJWT } from '../middlewares/auth.js';

const router: Router = Router();

router.get("/", userAuthJWT, getSegments);

router.get("/:id", userAuthJWT, getSingleSegment);

router.post("/", userAuthJWT, createSegment);

router.put("/:id", userAuthJWT, updateSegment);

router.delete("/:id", userAuthJWT, deleteSegement);


export default router;