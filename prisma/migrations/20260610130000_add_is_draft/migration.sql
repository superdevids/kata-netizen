-- AlterTable
ALTER TABLE `isu` ADD COLUMN `is_draft` BOOLEAN NOT NULL DEFAULT true;

-- Set all existing issues to non-draft (they were already published)
UPDATE `isu` SET `is_draft` = false;
