import { useState } from "react";
import { createBook } from "../api/bookApi";
import type { Book } from "../types/Book";

type Props = {
  userId: number;
  onClose: () => void;
  onCreate: (newBook: Book) => void;
};

type FieldErrors = {
  isbn?: string;
  title?: string;
  author?: string;
  image?: string;
  status?: string;
  general?: string;
};

export const BookCreateModal = ({ userId, onClose, onCreate }: Props) => {
  const [isIsbnForm, setIsIsbnForm] = useState(true);
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    try {
      const newBook = await createBook({
        isbn: isIsbnForm ? isbn : undefined,
        title: !isIsbnForm ? title : undefined,
        author: !isIsbnForm ? author : undefined,
        image: image || undefined,
        status,
        userId,
        isIsbnForm,
      });
      onCreate(newBook);
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err && err.error) {
        setErrors({ general: err.error });
      } else {
        setErrors({ general: "書籍登録中に不明なエラーが発生しました" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <h2 className="text-xl font-bold mb-4">書籍登録</h2>

        {/* 切替リンク */}
        <div className="text-right mb-4">
          <button
            className="text-sm text-blue-500 hover:underline"
            onClick={() => {setIsIsbnForm(!isIsbnForm); setErrors({})}}
          >
            {isIsbnForm ? "ISBNがわからない場合はこちら" : "ISBNから登録する"}
          </button>
        </div>

        {errors.general && (
          <div className="mb-4 text-red-600 text-sm">{errors.general}</div>
        )}

        {isIsbnForm ? (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">著者</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">画像</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">ステータス</label>
          <select
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value={1}>未読</option>
            <option value={2}>読書中</option>
            <option value={3}>読了</option>
          </select>
        </div>

        {/* ボタン */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600 transition"
          >
            {loading ? "登録中..." : "登録"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-6 py-2 rounded shadow hover:bg-gray-400 transition"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};
