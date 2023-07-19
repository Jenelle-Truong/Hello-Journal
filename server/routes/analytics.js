import express from "express";
import { analyzeSentiment } from "../controllers/analytics.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:userId", verifyToken, analyzeSentiment);
// router.get("/userId", analyzeSentiment)

export default router;