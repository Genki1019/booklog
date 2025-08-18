import express from "express";
import { getBooks, getBook, createBook, updateBook, deleteBook, } from "../controller/bookController.js";
import memoRouter from "./memo.js";
import { upload } from "../utils/image.js";
const router = express.Router();
// /api/books
router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", upload.single('image'), createBook);
router.put("/:id", upload.single('image'), updateBook);
router.delete("/:id", deleteBook);
// /api/books/:bookId/memos
router.use("/:bookId/memos", memoRouter);
export default router;
