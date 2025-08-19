import { Request, Response } from "express";
import * as fs from "fs";
import path from "path";
import { prisma } from "../prisma/client.js";
import { messages } from "../utils/messages.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// 書籍登録API
export const createBook = async (req: Request, res: Response) => {
  try {
    const { isbn, status, userId, isIsbnForm, title: manualTitle, author: manualAuthor } = req.body;
    let title = manualTitle || "";
    let author = manualAuthor || "";
    let imageUrl: string | null = null;

    // ISBNフォームの場合
    if (isIsbnForm === "true") {
      // ISBN必須チェック
      if (!isbn) {
        return res.status(400).json({ error: messages.errors.isbnRequired });
      }

      // ISBN重複チェック（ユーザーごと）
      const existingBook = await prisma.book.findFirst({ where: { userId: Number(userId), isbn } });
      if (existingBook) {
        return res.status(400).json({ error: messages.errors.bookAlreadyExists });
      }

      // Google Books APIから情報取得
      const googleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await googleRes.json();
      if (!data.items || data.items.length === 0) {
        return res.status(404).json({ error: messages.errors.bookNotFound });
      }

      const volumeInfo = data.items[0].volumeInfo;
      title = volumeInfo.title || "タイトル不明";
      author = volumeInfo.authors ? volumeInfo.authors.join(", ") : "著者不明";
      imageUrl = volumeInfo.imageLinks?.thumbnail || "https://placehold.jp/cccccc/ffffff/128x192.png?text=No%20Image";
    } else {
      // 画像アップロードがあればパスを設定
      if (req.file) {
        imageUrl = `${BASE_URL}/uploads/${req.file.filename}`;
      } else {
        imageUrl = "https://placehold.jp/cccccc/ffffff/128x192.png?text=No%20Image";
      }
    }

    const book = await prisma.book.create({
      data: {
        isbn: isbn || null,
        title,
        author,
        imageUrl,
        status: Number(status) || 1,
        userId: Number(userId),
      },
      include: { memos: true }, 
    });

    res.status(201).json({
      id: book.id,
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      imageUrl: book.imageUrl,
      status: book.status,
      memos: book.memos,
      userId: book.userId,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    });
  } catch (err) {
    console.error("書籍登録APIエラー:", err);
    res.status(500).json({ error: messages.errors.serverError });
  }
};

// 書籍取得API（複数件）
export const getBooks = async (req: Request, res: Response) => {
  try {
    const { title, author, status } = req.query;

    const whereClause: any = {};
    if (title) whereClause.title = { contains: String(title) };
    if (author) whereClause.author = { contains: String(author) };
    if (status) whereClause.status = Number(status);

    const books = await prisma.book.findMany({
      where: whereClause,
      include: { memos: true },
    });

    const booksWithLabel = books.map((book) => ({
      id: book.id,
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      imageUrl: book.imageUrl,
      status: book.status,
      memos: book.memos,
      userId: book.userId,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    }));

    res.json(booksWithLabel);
  } catch (err) {
    console.error("書籍取得API（複数件）エラー:", err);
    res.status(500).json({ error: messages.errors.serverError });
  }
};

// 書籍取得API（1件）
export const getBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
      include: { memos: true },
    });

    if (!book) return res.status(404).json({ error: messages.errors.bookNotFound });

    res.json({
      id: book.id,
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      imageUrl: book.imageUrl,
      status: book.status,
      memos: book.memos,
      userId: book.userId,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    });
  } catch (err) {
    console.error("書籍取得API（1件）エラー:", err);
    res.status(500).json({ error: messages.errors.serverError });
  }
};

// 書籍更新API
export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isbn, title: manualTitle, author: manualAuthor, status } = req.body;
    const bookId = Number(id);

    const existingBook = await prisma.book.findUnique({ where: { id: bookId } });
    if (!existingBook) {
      return res.status(404).json({ error: messages.errors.bookNotFound });
    }

    // 更新用データを動的に作成
    let newImageUrl = existingBook.imageUrl;
    const dataToUpdate: any = { status: status ? Number(status) : existingBook.status };

    if (!existingBook.isbn) {
      // 手動登録書籍は更新可能
      if (isbn) {
        // Google Books APIで情報取得
        const googleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
        const data = await googleRes.json();
        if (data.items && data.items.length > 0) {
          const volumeInfo = data.items[0].volumeInfo;
          if (volumeInfo.title) dataToUpdate.title = volumeInfo.title;
          if (volumeInfo.authors) dataToUpdate.author = volumeInfo.authors.join(", ");
          if (volumeInfo.imageLinks?.thumbnail) newImageUrl = volumeInfo.imageLinks.thumbnail;
        }
      } else {
        if (manualTitle?.trim()) dataToUpdate.title = manualTitle.trim();
        if (manualAuthor?.trim()) dataToUpdate.author = manualAuthor.trim();
        if (req.file) newImageUrl = `${BASE_URL}/uploads/${req.file.filename}`;
      }
    } else {
      // ISBN登録書籍はタイトル・著者・画像更新不可
      if (manualTitle || manualAuthor || req.file) {
        console.log("ISBN登録書籍のタイトル・著者・画像更新は無視されました");
      }
    }

    // 画像URLが変更された場合のみ更新
    if (newImageUrl !== existingBook.imageUrl) {
      dataToUpdate.imageUrl = newImageUrl;
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: dataToUpdate,
      include: { memos: true },
    });

    // 更新完了後に古い画像を削除（ローカルのupload/にある場合のみ）
    if (existingBook.imageUrl && existingBook.imageUrl.startsWith(`${BASE_URL}/uploads/`) && existingBook.imageUrl !== updatedBook.imageUrl) {
      const oldImagePath = path.join(process.cwd(), existingBook.imageUrl);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.warn(messages.errors.imageDeleteError(oldImagePath), err);
        else console.log(messages.success.imageDeleted(oldImagePath));
      });
    }

    res.json({
      id: updatedBook.id,
      isbn: updatedBook.isbn,
      title: updatedBook.title,
      author: updatedBook.author,
      imageUrl: updatedBook.imageUrl,
      status: updatedBook.status,
      memos: updatedBook.memos,
      userId: updatedBook.userId,
      createdAt: updatedBook.createdAt,
      updatedAt: updatedBook.updatedAt,
    });
  } catch (err) {
    console.error("書籍更新APIエラー:", err);
    res.status(500).json({ error: messages.errors.serverError });
  }
};

// 書籍削除API
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookId = Number(id);

    // 対象書籍存在チェック
    const existingBook = await prisma.book.findUnique({ where: { id: bookId } });
    if (!existingBook) {
      return res.status(404).json({ error: messages.errors.bookDeleteNotFound(bookId) });
    }

    // 画像ファイルが存在すれば削除
    if (existingBook.imageUrl) {
      const fileName = path.basename(existingBook.imageUrl);
      const filePath = path.join(process.cwd(), "uploads", fileName);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.warn(messages.errors.imageDeleteError(filePath));
        } else {
          console.log(messages.success.imageDeleted(filePath));
        }
      });
    }
    
    await prisma.book.delete({ where: { id: bookId } });

    res.json({ message: messages.success.bookDeleted(bookId) });
  } catch (err) {
    console.error("書籍削除APIエラー:", err);
    res.status(500).json({ error: messages.errors.serverError });
  }
};
