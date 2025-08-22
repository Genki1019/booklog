import { useEffect, useState } from "react";
import { fetchBooks } from "../api/bookApi";
import SearchForm from "../components/ SearchForm";
import { BookCreateModal } from "../components/BookCreateModal";
import BookShelf from "../components/BookShelf";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import DetailModal from "../components/DetailModal";
import type { Book } from "../types/Book";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book>();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  useEffect(() => {
    fetchBooks()
      .then(data => setBooks(data));
  }, []);

  const handleSearch = async (params: {title?: string, author?: string, status?: string}) => {
    const data = await fetchBooks(params);
    setBooks(data);
  };

  return (
    <div className="bg-[#FBF3E4] min-h-screen p-4">
      <Header />
      {/* 新規登録ボタン */}
      <div className="text-center mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
          onClick={() => setShowRegisterModal(true)}
        >
          新規登録
        </button>
      </div>

      {showRegisterModal && (
        <BookCreateModal
          userId={1}
          onClose={() => setShowRegisterModal(false)}
          onCreate={(newBook) => setBooks(prev => [newBook, ...prev])}
        />
      )}
      {/* 検索エリア */}
      <SearchForm onSearch={handleSearch} />

      {/* 書籍一覧 */}
      <BookShelf books={books} onSelectBook={setSelectedBook} />

      {/* 詳細モーダル */}
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
          onDelete={(deletedId) => {
            setBooks(prev => prev.filter(b => b.id !== deletedId));
            setSelectedBook(undefined);
          }}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onUpdateBook={async (_updatedBook) => {
            const latestBooks = await fetchBooks();
            setBooks(latestBooks);

            // 選択中の本も更新
            const updatedBook = latestBooks.find(b => b.id === selectedBook?.id);
            setSelectedBook(updatedBook);
          }}
        />
      )}

      <Footer />
    </div>
  );
}