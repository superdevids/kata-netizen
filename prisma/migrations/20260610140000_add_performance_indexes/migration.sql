-- CreateIndex
CREATE INDEX `isu_created_at_idx` ON `isu`(`created_at`);

-- CreateIndex
CREATE INDEX `isu_is_draft_aktif_idx` ON `isu`(`is_draft`, `aktif`);

-- CreateIndex
CREATE INDEX `isu_kategori_idx` ON `isu`(`kategori`);

-- CreateIndex
CREATE INDEX `isu_slug_idx` ON `isu`(`slug`);

-- CreateIndex
CREATE INDEX `tren_harian_isu_id_tanggal_idx` ON `tren_harian`(`isu_id`, `tanggal`);

-- CreateIndex
CREATE INDEX `narasi_isu_id_tanggal_idx` ON `narasi`(`isu_id`, `tanggal`);

-- CreateIndex
CREATE INDEX `keyword_harian_isu_id_tanggal_idx` ON `keyword_harian`(`isu_id`, `tanggal`);

-- CreateIndex
CREATE INDEX `entitas_agregat_isu_id_tanggal_idx` ON `entitas_agregat`(`isu_id`, `tanggal`);

-- CreateIndex
CREATE INDEX `indeks_kepercayaan_isu_id_tanggal_idx` ON `indeks_kepercayaan`(`isu_id`, `tanggal`);

-- CreateIndex
CREATE INDEX `reaksi_platform_isu_id_tanggal_idx` ON `reaksi_platform`(`isu_id`, `tanggal`);

-- CreateIndex
CREATE INDEX `eskalasi_isu_id_tanggal_idx` ON `eskalasi`(`isu_id`, `tanggal`);

-- CreateIndex
CREATE INDEX `momentum_shift_isu_id_tanggal_idx` ON `momentum_shift`(`isu_id`, `tanggal`);

-- CreateIndex
CREATE INDEX `echo_chamber_isu_id_tanggal_idx` ON `echo_chamber`(`isu_id`, `tanggal`);

-- CreateIndex
CREATE INDEX `summary_isu_isu_id_tanggal_idx` ON `summary_isu`(`isu_id`, `tanggal`);
