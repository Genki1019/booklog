const BASE_URL = 'http://localhost:3000/api';

export const fetchBooks = async () => {
  const res = await fetch(`${BASE_URL}/books`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
};

export const createBook = async (book: {
  isbn: string;
  title?: string;
  author?: string;
  status?: 'unread' | 'reading' | 'read';
}) => {
  const res = await fetch(`${BASE_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Failed to create book');
  return res.json();
};