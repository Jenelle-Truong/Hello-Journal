import express from "express";
import { createEntry, getSpecificEntry, updateEntry } from "../controllers/entries.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// CREATE
router.post("/", verifyToken, createEntry);

// READ
router.get("/:userId/:month/:day/:year", verifyToken, getSpecificEntry);

// UPDATE
router.put("/:id", verifyToken, updateEntry);

export default router;