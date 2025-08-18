import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// ---------- 本一覧取得 ----------
export const getBooks = async (req, res) => {
    try {
        const books = await prisma.book.findMany();
        res.json(books);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};
// ---------- 本登録 ----------
export const createBook = async (req, res) => {
    try {
        const { isbn, title, author, status } = req.body;
        if (!isbn)
            return res.status(400).json({ error: 'ISBN is required' });
        const newBook = await prisma.book.create({
            data: {
                isbn,
                title: title || 'タイトル未設定',
                author: author || '著者未設定',
                status,
                userId: 1,
            },
        });
        res.status(201).json(newBook);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create book' });
    }
};
// ---------- 本詳細取得 ----------
export const getBookById = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const book = await prisma.book.findUnique({
            where: { id },
            include: { memos: true },
        });
        if (!book)
            return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch book' });
    }
};
// ---------- 本更新 ----------
export const updateBook = async (req, res) => {
    const id = Number(req.params.id);
    const data = req.body;
    try {
        const updatedBook = await prisma.book.update({
            where: { id },
            data,
        });
        res.json(updatedBook);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update book' });
    }
};
// ---------- 本削除 ----------
export const deleteBook = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma.book.delete({ where: { id } });
        res.json({ message: 'Deleted' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
};
// ---------- メモ一覧 ----------
export const getMemos = async (req, res) => {
    const bookId = Number(req.params.id);
    try {
        const memos = await prisma.memo.findMany({ where: { bookId } });
        res.json(memos);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch memos' });
    }
};
// ---------- メモ追加 ----------
export const addMemo = async (req, res) => {
    const bookId = Number(req.params.id);
    const data = req.body;
    if (!data.content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    try {
        const newMemo = await prisma.memo.create({
            data: {
                bookId,
                content: data.content,
            },
        });
        res.status(201).json(newMemo);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add memo' });
    }
};
