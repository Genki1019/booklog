-- DropForeignKey
ALTER TABLE `Memo` DROP FOREIGN KEY `Memo_bookId_fkey`;

-- DropIndex
DROP INDEX `Memo_bookId_fkey` ON `Memo`;

-- AddForeignKey
ALTER TABLE `Memo` ADD CONSTRAINT `Memo_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
