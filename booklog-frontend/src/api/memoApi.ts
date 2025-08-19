import axios from "axios";
import type { Memo } from "../types/Memo";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const createMemo = async (bookId: number, content: string): Promise<Memo> => {
  try {
    const res = await axios.post(`${BASE_URL}/books/${bookId}/memos`, { content });
    return res.data;
  } catch (error) {
    console.error("読書メモ作成エラー: ", error);
    throw error;
  }
};

export const updateMemo = async (bookId: number, memoId: number, content: string): Promise<Memo> => {
  try {
    const res = await axios.put(`${BASE_URL}/books/${bookId}/memos/${memoId}`, { content });
    return res.data;
  } catch (error) {
    console.error("読書メモ更新エラー: ", error);
    throw error;
  }
}