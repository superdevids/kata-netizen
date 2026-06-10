-- AlterTable: Add nullable slug column with unique constraint
ALTER TABLE `isu` ADD COLUMN `slug` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `isu_slug_key` ON `isu`(`slug`);
