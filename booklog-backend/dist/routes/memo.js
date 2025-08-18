import express from "express";
import { getMemos, createMemo, updateMemo, deleteMemo } from "../controller/memoController.js";
const router = express.Router({ mergeParams: true });
router.get("/", getMemos);
router.post("/", createMemo);
router.put("/:memoId", updateMemo);
router.delete("/:memoId", deleteMemo);
export default router;
