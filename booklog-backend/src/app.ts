import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import bookRouter from './routes/book.js';
import { UPLOAD_DIR } from './utils/image.js';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/uploads', express.static(path.join(UPLOAD_DIR, '../uploads')));
app.use('/api/books', bookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // --- 開発用テストユーザー作成 ---
  const existingUser = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
  if (!existingUser) {
    await prisma.user.create({
      data: { name: 'テストユーザー', email: 'test@example.com', password: 'password' },
    });
  }
});
