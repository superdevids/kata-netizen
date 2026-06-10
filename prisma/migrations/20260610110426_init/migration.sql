-- CreateTable
CREATE TABLE `isu` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NULL,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `konten` TEXT NOT NULL,
    `thumbnail` TEXT NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `kata_kunci` TEXT NOT NULL,
    `aktif` BOOLEAN NOT NULL DEFAULT true,
    `is_draft` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `isu_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `postingan` (
    `id` VARCHAR(191) NOT NULL,
    `isu_id` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `judul` TEXT NULL,
    `url` TEXT NULL,
    `tanggal_post` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `komentar` (
    `id` VARCHAR(191) NOT NULL,
    `postingan_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NULL,
    `teks` TEXT NOT NULL,
    `tanggal` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `komentar_tanggal_idx`(`tanggal`),
    INDEX `komentar_postingan_id_idx`(`postingan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `analisis` (
    `id` VARCHAR(191) NOT NULL,
    `komentar_id` VARCHAR(191) NOT NULL,
    `sentimen` VARCHAR(191) NULL,
    `emosi` VARCHAR(191) NULL,
    `stance` VARCHAR(191) NULL,
    `intensitas` VARCHAR(191) NULL,
    `is_sarkasme` BOOLEAN NOT NULL DEFAULT false,
    `is_toxic` BOOLEAN NOT NULL DEFAULT false,
    `conf_sentimen` DECIMAL(5, 4) NULL,
    `conf_emosi` DECIMAL(5, 4) NULL,
    `conf_stance` DECIMAL(5, 4) NULL,
    `conf_intensitas` DECIMAL(5, 4) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `analisis_komentar_id_key`(`komentar_id`),
    INDEX `analisis_sentimen_idx`(`sentimen`),
    INDEX `analisis_emosi_idx`(`emosi`),
    INDEX `analisis_stance_idx`(`stance`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entitas` (
    `id` VARCHAR(191) NOT NULL,
    `komentar_id` VARCHAR(191) NOT NULL,
    `tipe` VARCHAR(191) NULL,
    `nilai` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `entitas_tipe_idx`(`tipe`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tren_harian` (
    `id` VARCHAR(191) NOT NULL,
    `isu_id` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `tanggal` DATE NOT NULL,
    `total_komentar` INTEGER NOT NULL DEFAULT 0,
    `jml_positif` INTEGER NOT NULL DEFAULT 0,
    `jml_negatif` INTEGER NOT NULL DEFAULT 0,
    `jml_netral` INTEGER NOT NULL DEFAULT 0,
    `pct_positif` DECIMAL(5, 2) NULL,
    `pct_negatif` DECIMAL(5, 2) NULL,
    `pct_netral` DECIMAL(5, 2) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `tren_harian_tanggal_idx`(`tanggal`),
    UNIQUE INDEX `tren_harian_isu_id_platform_tanggal_key`(`isu_id`, `platform`, `tanggal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reaksi_platform` (
    `id` VARCHAR(191) NOT NULL,
    `isu_id` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `tanggal` DATE NOT NULL,
    `total_komentar` INTEGER NOT NULL DEFAULT 0,
    `pct_positif` DECIMAL(5, 2) NULL,
    `pct_negatif` DECIMAL(5, 2) NULL,
    `pct_netral` DECIMAL(5, 2) NULL,
    `pct_mendukung` DECIMAL(5, 2) NULL,
    `pct_menolak` DECIMAL(5, 2) NULL,
    `pct_netral_stance` DECIMAL(5, 2) NULL,
    `dominant_emosi` VARCHAR(191) NULL,
    `toxic_rate` DECIMAL(5, 2) NULL,
    `sarkasme_rate` DECIMAL(5, 2) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `reaksi_platform_isu_id_platform_tanggal_key`(`isu_id`, `platform`, `tanggal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eskalasi` (
    `id` VARCHAR(191) NOT NULL,
    `isu_id` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NULL,
    `tanggal` DATE NOT NULL,
    `delta_negatif` INTEGER NULL,
    `delta_pct` DECIMAL(5, 2) NULL,
    `level` VARCHAR(191) NULL,
    `is_eskalasi` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `eskalasi_tanggal_idx`(`tanggal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `momentum_shift` (
    `id` VARCHAR(191) NOT NULL,
    `isu_id` VARCHAR(191) NOT NULL,
    `tanggal` DATE NOT NULL,
    `sentimen_sebelum` VARCHAR(191) NULL,
    `sentimen_sesudah` VARCHAR(191) NULL,
    `magnitude` DECIMAL(5, 4) NULL,
    `keterangan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `echo_chamber` (
    `id` VARCHAR(191) NOT NULL,
    `isu_id` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NULL,
    `tanggal` DATE NOT NULL,
    `variance_sentimen` DECIMAL(8, 6) NULL,
    `variance_stance` DECIMAL(8, 6) NULL,
    `is_echo_chamber` BOOLEAN NOT NULL DEFAULT false,
    `keterangan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perbandingan_isu` (
    `id` VARCHAR(191) NOT NULL,
    `isu_a_id` VARCHAR(191) NOT NULL,
    `isu_b_id` VARCHAR(191) NOT NULL,
    `tanggal` DATE NOT NULL,
    `korelasi_sentimen` DECIMAL(5, 4) NULL,
    `korelasi_stance` DECIMAL(5, 4) NULL,
    `keterangan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `indeks_kepercayaan` (
    `id` VARCHAR(191) NOT NULL,
    `isu_id` VARCHAR(191) NOT NULL,
    `tanggal` DATE NOT NULL,
    `skor_sentimen` DECIMAL(5, 2) NULL,
    `skor_stance` DECIMAL(5, 2) NULL,
    `skor_eskalasi` DECIMAL(5, 2) NULL,
    `indeks_final` DECIMAL(5, 2) NULL,
    `kategori` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `indeks_kepercayaan_isu_id_tanggal_key`(`isu_id`, `tanggal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `narasi` (
    `id` VARCHAR(191) NOT NULL,
    `isu_id` VARCHAR(191) NOT NULL,
    `tanggal` DATE NOT NULL,
    `narasi_ke` INTEGER NULL,
    `kata_kunci` JSON NULL,
    `jumlah_komentar` INTEGER NULL,
    `persentase` DECIMAL(5, 2) NULL,
    `contoh_komentar` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `narasi_tanggal_idx`(`tanggal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entitas_agregat` (
    `id` VARCHAR(191) NOT NULL,
    `isu_id` VARCHAR(191) NOT NULL,
    `tanggal` DATE NOT NULL,
    `tipe` VARCHAR(191) NULL,
    `nilai` TEXT NOT NULL,
    `jumlah` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `entitas_agregat_tanggal_idx`(`tanggal`),
    INDEX `entitas_agregat_tipe_idx`(`tipe`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `keyword_harian` (
    `id` VARCHAR(191) NOT NULL,
    `isu_id` VARCHAR(191) NOT NULL,
    `tanggal` DATE NOT NULL,
    `sentimen` VARCHAR(191) NULL,
    `kata` VARCHAR(191) NOT NULL,
    `frekuensi` INTEGER NOT NULL DEFAULT 0,
    `skor_tfidf` DECIMAL(8, 6) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `keyword_harian_tanggal_idx`(`tanggal`),
    INDEX `keyword_harian_sentimen_idx`(`sentimen`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `summary_isu` (
    `id` VARCHAR(191) NOT NULL,
    `isu_id` VARCHAR(191) NOT NULL,
    `tanggal` DATE NOT NULL,
    `periode` VARCHAR(191) NULL,
    `judul` TEXT NULL,
    `konten` LONGTEXT NULL,
    `editor` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `summary_isu_tanggal_idx`(`tanggal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `visitor_logs` (
    `id` VARCHAR(191) NOT NULL,
    `visitor_id` VARCHAR(191) NULL,
    `session_id` VARCHAR(191) NULL,
    `page_url` TEXT NULL,
    `referrer` TEXT NULL,
    `device_type` VARCHAR(191) NULL,
    `browser` VARCHAR(191) NULL,
    `os` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `ip_address` VARCHAR(191) NULL,
    `visited_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `visitor_logs_visited_at_idx`(`visited_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscribers` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `subscribed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `unsubscribed_at` DATETIME(3) NULL,

    UNIQUE INDEX `subscribers_email_key`(`email`),
    INDEX `subscribers_email_idx`(`email`),
    INDEX `subscribers_is_active_idx`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `postingan` ADD CONSTRAINT `postingan_isu_id_fkey` FOREIGN KEY (`isu_id`) REFERENCES `isu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `komentar` ADD CONSTRAINT `komentar_postingan_id_fkey` FOREIGN KEY (`postingan_id`) REFERENCES `postingan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analisis` ADD CONSTRAINT `analisis_komentar_id_fkey` FOREIGN KEY (`komentar_id`) REFERENCES `komentar`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entitas` ADD CONSTRAINT `entitas_komentar_id_fkey` FOREIGN KEY (`komentar_id`) REFERENCES `komentar`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tren_harian` ADD CONSTRAINT `tren_harian_isu_id_fkey` FOREIGN KEY (`isu_id`) REFERENCES `isu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reaksi_platform` ADD CONSTRAINT `reaksi_platform_isu_id_fkey` FOREIGN KEY (`isu_id`) REFERENCES `isu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eskalasi` ADD CONSTRAINT `eskalasi_isu_id_fkey` FOREIGN KEY (`isu_id`) REFERENCES `isu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `momentum_shift` ADD CONSTRAINT `momentum_shift_isu_id_fkey` FOREIGN KEY (`isu_id`) REFERENCES `isu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `echo_chamber` ADD CONSTRAINT `echo_chamber_isu_id_fkey` FOREIGN KEY (`isu_id`) REFERENCES `isu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perbandingan_isu` ADD CONSTRAINT `perbandingan_isu_isu_a_id_fkey` FOREIGN KEY (`isu_a_id`) REFERENCES `isu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perbandingan_isu` ADD CONSTRAINT `perbandingan_isu_isu_b_id_fkey` FOREIGN KEY (`isu_b_id`) REFERENCES `isu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `indeks_kepercayaan` ADD CONSTRAINT `indeks_kepercayaan_isu_id_fkey` FOREIGN KEY (`isu_id`) REFERENCES `isu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `narasi` ADD CONSTRAINT `narasi_isu_id_fkey` FOREIGN KEY (`isu_id`) REFERENCES `isu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entitas_agregat` ADD CONSTRAINT `entitas_agregat_isu_id_fkey` FOREIGN KEY (`isu_id`) REFERENCES `isu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `keyword_harian` ADD CONSTRAINT `keyword_harian_isu_id_fkey` FOREIGN KEY (`isu_id`) REFERENCES `isu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `summary_isu` ADD CONSTRAINT `summary_isu_isu_id_fkey` FOREIGN KEY (`isu_id`) REFERENCES `isu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
