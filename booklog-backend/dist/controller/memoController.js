import { prisma } from "../prisma/client.js";
import { messages } from "../utils/messages.js";
// メモ取得API
export const getMemos = async (req, res) => {
    try {
        const { bookId } = req.params;
        const memos = await prisma.memo.findMany({
            where: { bookId: Number(bookId) },
            orderBy: { createdAt: "desc" },
        });
        res.json(memos);
    }
    catch (err) {
        console.error("メモ取得APIエラー:", err);
        res.status(500).json({ error: messages.errors.serverError });
    }
};
// メモ登録API
export const createMemo = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { content } = req.body;
        const memo = await prisma.memo.create({
            data: { content: content.trim(), bookId: Number(bookId) },
        });
        res.status(201).json(memo);
    }
    catch (err) {
        console.error("メモ登録APIエラー:", err);
        res.status(500).json({ error: messages.errors.serverError });
    }
};
// メモ更新API
export const updateMemo = async (req, res) => {
    try {
        const { memoId } = req.params;
        const { content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ error: "メモ内容は必須です。" });
        }
        const updatedMemo = await prisma.memo.update({
            where: { id: Number(memoId) },
            data: { content: content.trim() },
        });
        res.json(updatedMemo);
    }
    catch (err) {
        console.error("メモ更新APIエラー:", err);
        res.status(500).json({ error: messages.errors.serverError });
    }
};
// メモ削除API
export const deleteMemo = async (req, res) => {
    try {
        const { memoId } = req.params;
        const id = Number(memoId);
        await prisma.memo.delete({ where: { id: id } });
        res.json({ message: messages.success.memoDeleted(id) });
    }
    catch (err) {
        console.error("メモ削除APIエラー:", err);
        res.status(500).json({ error: messages.errors.serverError });
    }
};
