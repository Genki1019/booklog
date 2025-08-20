import { useState } from "react";

type Props = {
  onSearch: (params: { title?: string; author?: string; status?: string }) => void;
};

export default function SearchForm ({ onSearch }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = () => {
    const params: { title?: string; author?: string; status?: string } = {};
    if (title.trim() !== "") params.title = title;
    if (author.trim() !== "") params.author = author;
    if (status.trim() !== "") params.status = status;
    onSearch(params);
  };

  return (
    <div className="my-6 bg-white shadow-md rounded-lg p-6 border border-gray-200 max-w-xl mx-auto">
      <div className="space-y-4">
        {/* タイトル */}
        <div className="flex items-center gap-4">
          <label className="w-24 text-gray-700 font-medium">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="タイトルを入力"
          />
        </div>

        {/* 著者名 */}
        <div className="flex items-center gap-4">
          <label className="w-24 text-gray-700 font-medium">著者名</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="著者名を入力"
          />
        </div>

        {/* ステータス */}
        <div className="flex items-center gap-4">
          <label className="w-24 text-gray-700 font-medium">ステータス</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-40 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">すべて</option>
            <option value="1">未読</option>
            <option value="2">読書中</option>
            <option value="3">読了</option>
          </select>
        </div>

        {/* 検索ボタン */}
        <div className="flex justify-center">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600 transition"
            onClick={handleSearch}
          >
            検索
          </button>
        </div>
      </div>
    </div>
  );
};
