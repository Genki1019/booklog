import type { Memo } from "./Memo";

export type Book = {
  id: number;
  isbn?: string;
  title: string;
  author?: string;
  imageUrl?: string;
  status: string;
  memos: Memo[];
  userId: number;
  createdAt: string;
  updatedAt: string;
}