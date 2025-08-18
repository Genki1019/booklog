/*
  Warnings:

  - A unique constraint covering the columns `[userId,isbn]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Book_isbn_key` ON `Book`;

-- AlterTable
ALTER TABLE `Book` MODIFY `isbn` VARCHAR(191) NULL,
    MODIFY `author` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Book_userId_isbn_key` ON `Book`(`userId`, `isbn`);
