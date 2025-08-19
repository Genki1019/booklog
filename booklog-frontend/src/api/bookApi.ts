import axios from "axios";
import type { Book } from "../types/Book";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/books`);
    return res.data;
  } catch (error) {
    console.error("書籍取得エラー: ", error);
    throw error;
  }
};

export const updateBookStatus = async (bookId: number, status: string): Promise<Book> => {
  const formData = new FormData();
  formData.append("status", status);
  try {
    const res = await axios.put(`${BASE_URL}/books/${bookId}`, formData);
    return res.data;
  } catch (error) {
    console.error("書籍ステータス更新エラー: ", error);
    throw error;
  }
};