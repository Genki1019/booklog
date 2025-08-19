import { useEffect, useState } from "react";
import { fetchBooks } from "../api/bookApi";
import { DetailModal } from "../components/DetailModal";
import type { Book } from "../types/Book";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book>();
  
  useEffect(() => {
    fetchBooks()
      .then(data => setBooks(data));
  }, []);

  return (
    <div className="bg-[#FBF3E4] min-h-screen p-4">
      <h1 className="text-3xl font-bold text-white bg-[url('/images/wood-shelf.png')] bg-cover px-6 py-3 shadow-md text-center">
        書籍管理アプリ
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6
                      auto-rows-[220px] sm:auto-rows-[260px] md:auto-rows-[280px] lg:auto-rows-[300px]">
        {books.map(book => (
          <div key={book.id} className="relative flex flex-col items-center justify-end">

            {/* 本の枠 */}
            <div className="flex justify-center mb-2 h-[calc(100%-32px)] z-10">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="max-h-full max-w-full object-contain shadow-[0_8px_12px_rgba(0,0,0,0.25)] cursor-pointer"
                onClick={() => setSelectedBook(book)}
              />
            </div>

            {/* 棚板：木目調 */}
            <div className="font-semibold text-white w-full h-8 bg-[url('/images/wood-shelf.png')] bg-cover shadow-[0_8px_12px_rgba(0,0,0,0.25)] relative flex items-center justify-center z-0 cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <span className="truncate w-full text-center px-2">{book.title}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedBook && (
        <DetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(undefined)}
          onUpdateMemo={(bookId, updatedMemo) => {
            setBooks(prev =>
              prev.map(b =>
                b.id === bookId
                  ? { ...b, memos: [updatedMemo] }
                  : b
              )
            );
            setSelectedBook(prev =>
              prev && prev.id === bookId ? { ...prev, memos: [updatedMemo] } : prev
            );
          }}
        />
      )}
    </div>
  );
}