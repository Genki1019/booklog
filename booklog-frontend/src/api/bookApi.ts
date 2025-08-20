import axios from "axios";
import type { Book } from "../types/Book";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

type FetchBooksParams = {
  title?: string;
  author?: string;
  status?: string;
};

export const fetchBooks = async (params: FetchBooksParams = {}): Promise<Book[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/books`, { params});
    return res.data;
  } catch (error) {
    console.error("書籍取得エラー: ", error);
    throw error;
  }
};

export const updateBookStatus = async (bookId: number, status: number): Promise<Book> => {
  const formData = new FormData();
  formData.append("status", String(status));
  try {
    const res = await axios.put(`${BASE_URL}/books/${bookId}`, formData);
    return res.data;
  } catch (error) {
    console.error("書籍ステータス更新エラー: ", error);
    throw error;
  }
};