import { prisma } from "./prisma";
import { cache, CACHE_KEYS } from "./cache";

// ─── Helpers ───────────────────────────────────────────────────────────────────
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function fmtDate(d: Date): string {
	return `${String(d.getDate()).padStart(2, "0")} ${BULAN[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
}

function fmtTanggal(d: Date): string {
	return `${d.getDate()} ${BULAN[d.getMonth()]}`;
}

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface IsuListItem {
	slug: string;
	title: string;
	description: string;
	thumbnail: string;
	kategori: string;
	date: string;
}

export interface RingkasanItem {
	label: string;
	value: string;
	sub: string;
}

export interface TrenHarianItem {
	tanggal: string;
	total: number;
	positif: number;
	negatif: number;
	netral: number;
}

export interface NarasiItem {
	label: string;
	pct: number;
	warna: string;
}

export interface NarasiDetailItem {
	no: string;
	judul: string;
	isi: string;
	warna: string;
	teks: string;
}

export interface KomentarVerbatimItem {
	narasi: string;
	komentar: { username: string; teks: string }[];
}

export interface PlatformReaksiItem {
	nama: string;
	positif: number;
	negatif: number;
	netral: number;
	toxic: number;
}

export interface StanceItem {
	platform: string;
	mendukung: number;
	menolak: number;
	netral: number;
}

export interface EskalasiItem {
	tanggal: string;
	delta: number;
	level: string;
	is_eskalasi: boolean;
}

export interface MomentumItem {
	tanggal: string;
	sebelum: string;
	sesudah: string;
	magnitude: number;
	keterangan: string;
}

export interface EchoChamberItem {
	platform: string;
	var_sentimen: number;
	var_stance: number;
	is_echo: boolean;
}

export interface IndeksTimeItem {
	tanggal: string;
	skor: number;
	sentimen: number;
	stance: number;
	eskalasi: number;
}

export interface EntitasItem {
	nama: string;
	tipe: string;
	jumlah: number;
}

export interface SummaryItem {
	judul: string;
	periode: string;
	tanggal: string;
	editor: string;
	konten: string;
}

export interface KeywordsData {
	positif: string[];
	negatif: string[];
	netral: string[];
}

export interface IndeksInfo {
	skor: number;
	kategori: string;
	sentimen: number;
	stance: number;
}

export interface ArticleAnalysisData {
	ringkasan: RingkasanItem[];
	tren_harian: TrenHarianItem[];
	narasi: NarasiItem[];
	narasi_detail: NarasiDetailItem[];
	narasi_komentar: KomentarVerbatimItem[];
	keywords: KeywordsData;
	entitas: EntitasItem[];
	indeks: IndeksInfo;
	platforms: PlatformReaksiItem[];
	stance_platform: StanceItem[];
	eskalasi: EskalasiItem[];
	momentum_shifts: MomentumItem[];
	echo_chamber: EchoChamberItem[];
	indeks_timeseries: IndeksTimeItem[];
	summary: SummaryItem[];
}

export interface IsuDetailResult {
	slug: string;
	title: string;
	description: string;
	konten: string;
	thumbnail: string;
	kategori: string;
	kata_kunci: string;
	date: string;
	readTime: number;
	analysis: ArticleAnalysisData;
}

export interface TrendingItem {
	title: string;
	date: string;
	slug: string;
	thumbnail?: string;
}

// ─── Warna narasi (cycle) ──────────────────────────────────────────────────────
const NARASI_WARNA = [
	{ warna: "#4ADE80", border: "border-green-300 bg-green-50", teks: "text-green-800" },
	{ warna: "#F87171", border: "border-red-300 bg-red-50", teks: "text-red-800" },
	{ warna: "#FB923C", border: "border-orange-300 bg-orange-50", teks: "text-orange-800" },
	{ warna: "#60A5FA", border: "border-blue-300 bg-blue-50", teks: "text-blue-800" },
	{ warna: "#A78BFA", border: "border-purple-300 bg-purple-50", teks: "text-purple-800" },
];

// ─── Queries ───────────────────────────────────────────────────────────────────

/** Get distinct active categories */
export async function getKategori(includeDrafts = false): Promise<string[]> {
	const cacheKey = CACHE_KEYS.KATEGORI;
	const cached = cache.get<string[]>(cacheKey);
	if (cached) return cached;

	const hasil = await prisma.isu.findMany({
		where: { ...(includeDrafts ? {} : { is_draft: false, aktif: true }) },
		select: { kategori: true },
		distinct: ["kategori"],
		orderBy: { kategori: "asc" },
	});
	const result = hasil.map((i) => i.kategori).filter((k): k is string => !!k);
	
	cache.set(cacheKey, result, { ttl: 30 * 60 * 1000 }); // Cache 30 minutes (rarely changes)
	return result;
}

/** Get list of isu (for home page cards). Public: only published+active. Admin: all. */
export async function getIsuList(kategori?: string, search?: string, includeDrafts = false): Promise<IsuListItem[]> {
	const cacheKey = CACHE_KEYS.ISU_LIST(kategori, search);
	const cached = cache.get<IsuListItem[]>(cacheKey);
	if (cached) return cached;

	const data = await prisma.isu.findMany({
		where: {
			...(includeDrafts ? {} : { is_draft: false, aktif: true, summary_isu: { some: {} } }),
			...(kategori && kategori !== "Untuk Anda" ? { kategori } : {}),
			...(search ? { judul: { contains: search } } : {}),
		},
		orderBy: { created_at: "desc" },
		take: 20,
		select: {
			id: true,
			slug: true,
			judul: true,
			deskripsi: true,
			thumbnail: true,
			kategori: true,
			created_at: true,
		},
	});
	const result = data.map((i) => ({
		slug: i.slug || i.id,
		date: fmtDate(i.created_at),
		title: i.judul,
		description: i.deskripsi,
		thumbnail: i.thumbnail,
		kategori: i.kategori,
	}));

	cache.set(cacheKey, result, { ttl: 30 * 60 * 1000 }); // Cache 30 minutes
	return result;
}

/** Get trending isu (for sidebar). Public: only published+active. */
export async function getTrending(limit = 10, includeDrafts = false): Promise<TrendingItem[]> {
	const cacheKey = CACHE_KEYS.TRENDING(limit);
	const cached = cache.get<TrendingItem[]>(cacheKey);
	if (cached) return cached;

	const data = await prisma.isu.findMany({
		where: { ...(includeDrafts ? {} : { is_draft: false, aktif: true }) },
		orderBy: { created_at: "desc" },
		take: limit,
		select: { id: true, slug: true, judul: true, created_at: true },
	});
	const result = data.map((i) => ({
		title: i.judul,
		date: fmtDate(i.created_at),
		slug: i.slug || i.id,
	}));

	cache.set(cacheKey, result, { ttl: 30 * 60 * 1000 }); // Cache 30 minutes
	return result;
}

/** Get recommended/related isu (different from current). Public: only published+active. */
export async function getRecommended(currentSlug?: string, limit = 5, includeDrafts = false): Promise<TrendingItem[]> {
	const data = await prisma.isu.findMany({
		where: {
			...(includeDrafts ? {} : { is_draft: false, aktif: true, summary_isu: { some: {} } }),
			...(currentSlug ? { OR: [{ slug: { not: currentSlug } }, { id: { not: currentSlug } }] } : {}),
		},
		orderBy: { created_at: "desc" },
		take: limit,
		select: { id: true, slug: true, judul: true, deskripsi: true, thumbnail: true, kategori: true, created_at: true },
	});
	return data.map((i) => ({
		title: i.judul,
		date: fmtDate(i.created_at),
		slug: i.slug || i.id,
		thumbnail: i.thumbnail,
	}));
}

/**
 * Get full article detail + all analysis data.
 * Public: only published (non-draft). Admin (includeDrafts): all.
 */
export async function getIsuDetail(slug: string, includeDrafts = false): Promise<IsuDetailResult | null> {
	const cacheKey = CACHE_KEYS.ISU_DETAIL(slug);
	const cached = cache.get<IsuDetailResult>(cacheKey);
	if (cached) return cached;

	const isu = await prisma.isu.findFirst({
		where: {
			OR: [{ slug }, { id: slug }],
			...(includeDrafts ? {} : { is_draft: false }),
		},
		select: {
			id: true,
			slug: true,
			judul: true,
			deskripsi: true,
			konten: true,
			thumbnail: true,
			kategori: true,
			kata_kunci: true,
			updated_at: true,
		},
	});

	if (!isu) return null;
	const readTime = Math.max(1, Math.round(isu.konten.trim().split(/\s+/).length / 200));

	// Fetch all analysis data in parallel (optimized for performance)
	const [trenHarian, narasi, keywordHarian, entitasAgregat, indeksKepercayaan, reaksiPlatform, eskalasi, momentumShift, echoChamber, summaryIsu] = await Promise.all([
		// Tren harian (last 7 days, all platforms — will be aggregated by date)
		prisma.trenHarian.findMany({
			where: { isu_id: isu.id },
			orderBy: { tanggal: "asc" },
			take: 50,
			select: {
				tanggal: true,
				total_komentar: true,
				jml_positif: true,
				jml_negatif: true,
				jml_netral: true,
				pct_positif: true,
			},
		}),
		// Narasi (latest date)
		prisma.narasi.findMany({
			where: { isu_id: isu.id },
			orderBy: [{ tanggal: "desc" }, { narasi_ke: "asc" }],
			take: 10,
			select: {
				tanggal: true,
				narasi_ke: true,
				kata_kunci: true,
				persentase: true,
				contoh_komentar: true,
			},
		}),
		// Keywords (latest date)
		prisma.keywordHarian.findMany({
			where: { isu_id: isu.id },
			orderBy: [{ tanggal: "desc" }, { frekuensi: "desc" }],
			take: 30,
			select: {
				sentimen: true,
				kata: true,
				frekuensi: true,
			},
		}),
		// Entity aggregates (latest date)
		prisma.entitasAgregat.findMany({
			where: { isu_id: isu.id },
			orderBy: [{ tanggal: "desc" }, { jumlah: "desc" }],
			take: 10,
			select: {
				tipe: true,
				nilai: true,
				jumlah: true,
			},
		}),
		// Trust index (last 3 data points)
		prisma.indeksKepercayaan.findMany({
			where: { isu_id: isu.id },
			orderBy: { tanggal: "asc" },
			take: 3,
			select: {
				tanggal: true,
				skor_sentimen: true,
				skor_stance: true,
				skor_eskalasi: true,
				indeks_final: true,
				kategori: true,
			},
		}),
		// Platform reactions (latest date)
		prisma.reaksiPlatform.findMany({
			where: { isu_id: isu.id },
			orderBy: [{ tanggal: "desc" }, { platform: "asc" }],
			take: 10,
			select: {
				platform: true,
				tanggal: true,
				pct_positif: true,
				pct_negatif: true,
				pct_netral: true,
				pct_mendukung: true,
				pct_menolak: true,
				pct_netral_stance: true,
				toxic_rate: true,
				sarkasme_rate: true,
			},
		}),
		// Escalation (last 7 days)
		prisma.eskalasi.findMany({
			where: { isu_id: isu.id },
			orderBy: { tanggal: "asc" },
			take: 7,
			select: {
				tanggal: true,
				delta_negatif: true,
				level: true,
				is_eskalasi: true,
			},
		}),
		// Momentum shifts
		prisma.momentumShift.findMany({
			where: { isu_id: isu.id },
			orderBy: { tanggal: "asc" },
			take: 5,
			select: {
				tanggal: true,
				sentimen_sebelum: true,
				sentimen_sesudah: true,
				magnitude: true,
				keterangan: true,
			},
		}),
		// Echo chamber (latest date)
		prisma.echoChamber.findMany({
			where: { isu_id: isu.id },
			orderBy: [{ tanggal: "desc" }, { platform: "asc" }],
			take: 5,
			select: {
				platform: true,
				variance_sentimen: true,
				variance_stance: true,
				is_echo_chamber: true,
			},
		}),
		// Summary
		prisma.summaryIsu.findMany({
			where: { isu_id: isu.id },
			orderBy: { tanggal: "desc" },
			take: 3,
			select: {
				judul: true,
				periode: true,
				tanggal: true,
				editor: true,
				konten: true,
			},
		}),
	]);

	// ─── Transform data ────────────────────────────────────────────────────

	const analisis = buildAnalysis({
		trenHarian,
		narasi,
		keywordHarian,
		entitasAgregat,
		indeksKepercayaan,
		reaksiPlatform,
		eskalasi,
		momentumShift,
		echoChamber,
		summaryIsu,
	});

	const result = {
		slug: isu.slug || isu.id,
		title: isu.judul,
		description: isu.deskripsi,
		konten: isu.konten,
		thumbnail: isu.thumbnail,
		kategori: isu.kategori,
		kata_kunci: isu.kata_kunci,
		date: fmtDate(isu.updated_at),
		readTime,
		analysis: analisis,
	};

	// Cache article detail for 30 minutes (articles rarely change)
	cache.set(cacheKey, result, { ttl: 30 * 60 * 1000 });
	return result;
}

// ─── Build analysis data from raw DB results ───────────────────────────────────

interface BuildAnalysisInput {
	trenHarian: any[];
	narasi: any[];
	keywordHarian: any[];
	entitasAgregat: any[];
	indeksKepercayaan: any[];
	reaksiPlatform: any[];
	eskalasi: any[];
	momentumShift: any[];
	echoChamber: any[];
	summaryIsu: any[];
}

function buildAnalysis(input: BuildAnalysisInput): ArticleAnalysisData {
	const { trenHarian, narasi, keywordHarian, entitasAgregat, indeksKepercayaan, reaksiPlatform, eskalasi, momentumShift, echoChamber, summaryIsu } = input;

	// ── Ringkasan ──
	// Aggregate trenHarian by date (sum across platforms)
	const trenByDate = new Map<string, { total: number; positif: number; negatif: number; netral: number; pct_positif: number; count: number }>();
	trenHarian.forEach((t) => {
		const key = new Date(t.tanggal).toISOString().slice(0, 10);
		const existing = trenByDate.get(key);
		if (existing) {
			existing.total += Number(t.total_komentar) || 0;
			existing.positif += Number(t.jml_positif) || 0;
			existing.negatif += Number(t.jml_negatif) || 0;
			existing.netral += Number(t.jml_netral) || 0;
			existing.pct_positif += Number(t.pct_positif) || 0;
			existing.count += 1;
		} else {
			trenByDate.set(key, {
				total: Number(t.total_komentar) || 0,
				positif: Number(t.jml_positif) || 0,
				negatif: Number(t.jml_negatif) || 0,
				netral: Number(t.jml_netral) || 0,
				pct_positif: Number(t.pct_positif) || 0,
				count: 1,
			});
		}
	});
	// Sort by date ascending, take last 7
	const aggregatedTren = Array.from(trenByDate.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.slice(-7)
		.map(([dateStr, vals]) => ({
			tanggal: new Date(dateStr),
			total_komentar: vals.total,
			jml_positif: vals.positif,
			jml_negatif: vals.negatif,
			jml_netral: vals.netral,
			pct_positif: vals.count > 0 ? vals.pct_positif / vals.count : 0,
		}));

	const latestTren = aggregatedTren[aggregatedTren.length - 1];
	const totalKomentar = latestTren?.total_komentar ?? 0;
	const avgPositif = aggregatedTren.length > 0 ? Math.round(aggregatedTren.reduce((a, t) => a + t.pct_positif, 0) / aggregatedTren.length) : 0;
	const latestIdx = indeksKepercayaan[indeksKepercayaan.length - 1];
	const entitasCount = entitasAgregat.length;
	const platformCount = new Set(reaksiPlatform.map((r) => r.platform)).size;

	const ringkasan: RingkasanItem[] = [
		{ label: "Total komentar", value: String(totalKomentar), sub: `${platformCount} platform` },
		{ label: "Sentimen positif", value: `~${avgPositif}%`, sub: `rata-rata ${aggregatedTren.length} hari` },
		{ label: "Indeks kepercayaan", value: latestIdx ? String(Number(latestIdx.indeks_final) || 0) : "0", sub: latestIdx?.kategori || "belum ada" },
		{ label: "Entitas disebut", value: String(entitasCount), sub: "tokoh & lembaga" },
	];

	// ── Tren harian (aggregated) ──
	const tren_harian: TrenHarianItem[] = aggregatedTren.map((t) => ({
		tanggal: fmtTanggal(t.tanggal),
		total: t.total_komentar,
		positif: t.jml_positif,
		negatif: t.jml_negatif,
		netral: t.jml_netral,
	}));

	// ── Narasi ──
	const narasiItems: NarasiItem[] = narasi.map((n, i) => ({
		label: (n.kata_kunci as any)?.judul || `Narasi ${i + 1}`,
		pct: Number(n.persentase) || 0,
		warna: NARASI_WARNA[i % NARASI_WARNA.length].warna,
	}));

	const narasi_detail: NarasiDetailItem[] = narasi.map((n, i) => {
		const w = NARASI_WARNA[i % NARASI_WARNA.length];
		return {
			no: String(i + 1).padStart(2, "0"),
			judul: (n.kata_kunci as any)?.judul || `Narasi ${i + 1}`,
			isi: (n.kata_kunci as any)?.deskripsi || "",
			warna: w.border,
			teks: w.teks,
		};
	});

	// ── Narasi komentar (verbatim) ──
	const narasi_komentar: KomentarVerbatimItem[] = narasi
		.filter((n) => n.contoh_komentar && Array.isArray(n.contoh_komentar))
		.map((n) => ({
			narasi: (n.kata_kunci as any)?.judul || "Narasi",
			komentar: ((n.contoh_komentar as any[]) || []).map((k) => ({
				username: k.username || "anonim",
				teks: k.teks || "",
			})),
		}));

	// ── Keywords ──
	const keywords: KeywordsData = { positif: [], negatif: [], netral: [] };
	keywordHarian.forEach((k) => {
		const sent = (k.sentimen || "netral").toLowerCase();
		if (sent === "positif" && keywords.positif.length < 5) keywords.positif.push(k.kata);
		else if (sent === "negatif" && keywords.negatif.length < 5) keywords.negatif.push(k.kata);
		else if (keywords.netral.length < 5) keywords.netral.push(k.kata);
	});

	// ── Entitas ──
	const entitas: EntitasItem[] = entitasAgregat.map((e) => ({
		nama: e.nilai,
		tipe: e.tipe || "LAINNYA",
		jumlah: e.jumlah,
	}));

	// ── Indeks ──
	const indeks: IndeksInfo = latestIdx
		? {
			skor: Number(latestIdx.indeks_final) || 0,
			kategori: latestIdx.kategori || "Belum ada",
			sentimen: Number(latestIdx.skor_sentimen) || 0,
			stance: Number(latestIdx.skor_stance) || 0,
		}
		: { skor: 0, kategori: "Belum ada", sentimen: 0, stance: 0 };

	// ── Platform reactions + Stance (single pass) ──
	const platformMap = new Map<string, any>();
	reaksiPlatform.forEach((r) => {
		const key = r.platform;
		if (!platformMap.has(key) || new Date(r.tanggal) > new Date(platformMap.get(key).tanggal)) {
			platformMap.set(key, r);
		}
	});
	const platforms: PlatformReaksiItem[] = [];
	const stance_platform: StanceItem[] = [];
	for (const r of platformMap.values()) {
		platforms.push({
			nama: r.platform,
			positif: Number(r.pct_positif) || 0,
			negatif: Number(r.pct_negatif) || 0,
			netral: Number(r.pct_netral) || 0,
			toxic: Number(r.toxic_rate) || 0,
		});
		stance_platform.push({
			platform: r.platform,
			mendukung: Number(r.pct_mendukung) || 0,
			menolak: Number(r.pct_menolak) || 0,
			netral: Number(r.pct_netral_stance) || 0,
		});
	}

	// ── Eskalasi ──
	const eskalasiData: EskalasiItem[] = eskalasi.map((e) => ({
		tanggal: fmtTanggal(new Date(e.tanggal)),
		delta: e.delta_negatif || 0,
		level: e.level || "rendah",
		is_eskalasi: e.is_eskalasi,
	}));

	// ── Momentum shifts ──
	const momentum_shifts: MomentumItem[] = momentumShift.map((m) => ({
		tanggal: fmtTanggal(new Date(m.tanggal)),
		sebelum: m.sentimen_sebelum || "netral",
		sesudah: m.sentimen_sesudah || "netral",
		magnitude: Number(m.magnitude) || 0,
		keterangan: m.keterangan || "",
	}));

	// ── Echo chamber ──
	const echo_chamber_data: EchoChamberItem[] = echoChamber.map((e) => ({
		platform: e.platform || "Unknown",
		var_sentimen: Number(e.variance_sentimen) || 0,
		var_stance: Number(e.variance_stance) || 0,
		is_echo: e.is_echo_chamber,
	}));

	// ── Indeks time series ──
	const indeks_timeseries: IndeksTimeItem[] = indeksKepercayaan.map((i) => ({
		tanggal: fmtTanggal(new Date(i.tanggal)),
		skor: Number(i.indeks_final) || 0,
		sentimen: Number(i.skor_sentimen) || 0,
		stance: Number(i.skor_stance) || 0,
		eskalasi: Number(i.skor_eskalasi) || 0,
	}));

	// ── Summary ──
	const summary: SummaryItem[] = summaryIsu.map((s) => ({
		judul: s.judul || "",
		periode: s.periode || "harian",
		tanggal: fmtDate(new Date(s.tanggal)),
		editor: s.editor || "system",
		konten: s.konten || "",
	}));

	return {
		ringkasan,
		tren_harian,
		narasi: narasiItems,
		narasi_detail,
		narasi_komentar,
		keywords,
		entitas,
		indeks,
		platforms,
		stance_platform,
		eskalasi: eskalasiData,
		momentum_shifts,
		echo_chamber: echo_chamber_data,
		indeks_timeseries,
		summary,
	};
}
