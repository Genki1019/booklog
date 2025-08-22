import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { deleteBook, updateBookStatus } from "../api/bookApi";
import { createMemo, updateMemo } from "../api/memoApi";
import type { Book } from "../types/Book";
import type { Memo } from "../types/Memo";
import { BookUpdateModal } from "./BookUpdateModal";

type Props = {
  book: Book;
  onClose: () => void;
  onUpdateMemo: (bookId: number, updatedMemo: Memo) => void;
  onDelete: (bookId: number) => void;
  onUpdateBook: (updatedBook: Book) => void;
};

export default function DetailModal({ book, onClose, onUpdateMemo, onDelete, onUpdateBook }: Props) {
  const [memoText, setMemoText] = useState(book.memos[0]?.content || "");
  const [memoId, setMemoId] = useState<number | null>(book.memos[0]?.id || null);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(book.status);
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const STATUS_LABEL = {
    1: "未読",
    2: "読書中",
    3: "読了"
  };

  const statusLabel = STATUS_LABEL[status as 1 | 2 | 3] ?? "未設定";

  const saveMemo = async () => {
    if (!memoText.trim()) return;

    try {
      if (memoId) {
        const updated = await updateMemo(book.id, memoId, memoText.trim());
        setMemoText(updated.content);
        onUpdateMemo(book.id, updated);
      } else {
        const newMemo = await createMemo(book.id, memoText.trim());
        setMemoId(newMemo.id);
        setMemoText(newMemo.content);
        onUpdateMemo(book.id, newMemo);
      }
      setEditing(false);
    } catch (err) {
      console.error("メモ保存エラー:", err);
    }
  };

  // ステータス切り替え処理
  const toggleStatus = async () => {
    try {
      const nextStatus = status % 3 + 1;
      const updatedBook = await updateBookStatus(book.id, nextStatus);
      setStatus(updatedBook.status);
      onUpdateBook(updatedBook);
    } catch (err) {
      console.error("ステータス更新エラー:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) return;
    setLoading(true);
    try {
      await deleteBook(book.id);
      onDelete(book.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message || "削除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 詳細モーダル */}
      {!isEditOpen && (
        <Dialog open={true} onClose={onClose} className="relative z-50">
          <div className="fixed inset-0 bg-black bg-opacity-30" />
          <div className="fixed inset-0 flex items-start justify-center p-8 overflow-auto">
            <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-4xl h-[80vh] my-8 overflow-auto">
              <div className="flex justify-between items-start mb-4">
                <img src={book.imageUrl} alt={book.title} className="w-30 h-auto mr-10" />
                <div className="flex-1">
                  <Dialog.Title className="text-xl font-bold">{book.title}</Dialog.Title>
                  <p className="text-gray-700">著者: {book.author}</p>
                </div>
                <div
                  onClick={toggleStatus}
                  className="text-sm font-semibold text-white bg-gray-500 px-2 py-1 rounded cursor-pointer select-none"
                >
                  {statusLabel}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">メモ</h3>
              <div
                className="p-2 rounded cursor-text mb-4 border-gray-300"
                onClick={() => setEditing(true)}
              >
                {editing ? (
                  <textarea
                    value={memoText}
                    onChange={(e) => setMemoText(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="メモを入力..."
                  />
                ) : (
                  memoText || "クリックしてメモを入力..."
                )}
              </div>

              <div className="flex justify-end gap-2">
                {editing && (
                  <button
                    onClick={saveMemo}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    保存
                  </button>
                )}
                <button
                  onClick={() => setIsEditOpen(true)}
                  className={`px-4 py-2 rounded text-white ${
                    book.isbn ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                  }`}
                  disabled={!!book.isbn}
                >
                  編集
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  削除
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  閉じる
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

      {/* 編集モーダル */}
      {isEditOpen && (
        <BookUpdateModal
          book={book}
          onClose={() => setIsEditOpen(false)}
          onUpdate={(updatedBook) => {
            onUpdateBook(updatedBook);
            setIsEditOpen(false);
          }}
        />
      )}
    </>
  );
}
