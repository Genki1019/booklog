import type { Book } from "../types/Book";

type Props = {
  books: Book[];
  onSelectBook: (book: Book) => void;
};

export default function BookShelf ({ books, onSelectBook }: Props) {
  return (
    <>
      <hr />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 py-6 
                      auto-rows-[220px] sm:auto-rows-[260px] md:auto-rows-[280px] lg:auto-rows-[300px]">
        {books.map(book => (
          <div key={book.id} className="relative flex flex-col items-center justify-end">
            <div className="flex justify-center mb-2 h-[calc(100%-32px)] z-10">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="max-h-full max-w-full object-contain shadow-[0_8px_12px_rgba(0,0,0,0.25)] cursor-pointer"
                onClick={() => onSelectBook(book)}
              />
            </div>
            <div
              className="font-semibold text-white w-full h-8 bg-[url('/images/wood-shelf.png')] bg-cover
                        shadow-[0_8px_12px_rgba(0,0,0,0.25)] relative flex items-center justify-center z-0 cursor-pointer"
              onClick={() => onSelectBook(book)}
            >
              <span className="truncate w-full text-center px-2">{book.title}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
