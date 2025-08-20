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
    const res = await axios.get(`${BASE_URL}/books`, { params });
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

type CreateBookParams = {
  isbn?: string;
  title?: string;
  author?: string;
  image?: File;
  status: number;
  userId: number;
  isIsbnForm: boolean;
};

export const createBook = async (params: CreateBookParams): Promise<Book> => {
  const formData = new FormData();

  if (params.isbn) formData.append("isbn", params.isbn);
  if (params.title) formData.append("title", params.title);
  if (params.author) formData.append("author", params.author);
  if (params.image) formData.append("image", params.image);
  if (params.status !== undefined) formData.append("status", String(params.status));
  
  formData.append("userId", String(params.userId));
  formData.append("isIsbnForm", String(params.isIsbnForm));

  try {
    const res = await axios.post(`${BASE_URL}/books`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw error.response.data;
    }
    throw error;
  }
};

