import type { Book } from "../types/Book";

type Props = {
  book: Book;
  onClick: () => void;
}

export default function BookCard({ book, onClick }: Props) {
  return (
    <div className="cursor-pointer flex flex-col items-center z-10">
      <img
        src={book.imageUrl}
        alt={book.title}
        className="object-contain max-h-48 mb-1"
        onClick={onClick}
      />
    </div>
  );
}
