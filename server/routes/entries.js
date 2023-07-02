import express from "express";
import { createEntry, getUserEntries, updateEntry } from "../controllers/entries.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// CREATE
router.post("/entries", verifyToken, createEntry);

// READ
router.get("/entries", verifyToken, getUserEntries);

// UPDATE
router.patch("/entries", verifyToken, updateEntry);

export default router;