import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTIKEL_DIR = path.join(process.cwd(), "content/artikel");

// ─── Types (Kompatibel dengan lib/query.ts) ─────────────────────────────────

export interface RingkasanItem { label: string; value: string; sub: string }
export interface TrenHarianItem { tanggal: string; total: number; positif: number; negatif: number; netral: number }
export interface NarasiItem { label: string; pct: number; warna: string }
export interface NarasiDetailItem { no: string; judul: string; isi: string; warna: string; teks: string }
export interface KomentarVerbatimItem { narasi: string; komentar: { username: string; teks: string }[] }
export interface PlatformReaksiItem { nama: string; positif: number; negatif: number; netral: number; toxic: number }
export interface StanceItem { platform: string; mendukung: number; menolak: number; netral: number }
export interface EskalasiItem { tanggal: string; delta: number; level: string; is_eskalasi: boolean }
export interface MomentumItem { tanggal: string; sebelum: string; sesudah: string; magnitude: number; keterangan: string }
export interface EchoChamberItem { platform: string; var_sentimen: number; var_stance: number; is_echo: boolean }
export interface IndeksTimeItem { tanggal: string; skor: number; sentimen: number; stance: number; eskalasi: number }
export interface KeywordsData { positif: string[]; negatif: string[]; netral: string[] }
export interface EntitasItem { nama: string; tipe: string; jumlah: number }
export interface SummaryItem { judul: string; periode: string; tanggal: string; editor: string; konten: string }
export interface IndeksInfo { skor: number; kategori: string; sentimen: number; stance: number }

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

export interface ArticleData {
	slug: string;
	title: string;
	description: string;
	konten: string;            // |||-separated body content
	thumbnail: string;
	kategori: string;
	kata_kunci: string;
	date: string;
	readTime: number;
	analysis: ArticleAnalysisData;
}

export interface ArticleListItem {
	slug: string;
	title: string;
	description: string;
	thumbnail: string;
	kategori: string;
	date: string;
}

// ─── Frontmatter Schema ─────────────────────────────────────────────────────

interface MdFrontmatter {
	title?: string;
	description?: string;
	thumbnail?: string;
	kategori?: string;
	date?: string;
	kata_kunci?: string;
	readTime?: number;

	// Body content parts (YAML array of strings — akan digabung pake |||)
	parts?: string[];

	// Analysis data (YAML arrays/objects)
	ringkasan?: RingkasanItem[];
	tren_harian?: TrenHarianItem[];
	narasi?: NarasiItem[];
	narasi_detail?: NarasiDetailItem[];
	narasi_komentar?: KomentarVerbatimItem[];
	keywords?: KeywordsData;
	entitas?: EntitasItem[];
	indeks?: IndeksInfo;
	platforms?: PlatformReaksiItem[];
	stance_platform?: StanceItem[];
	eskalasi?: EskalasiItem[];
	momentum_shifts?: MomentumItem[];
	echo_chamber?: EchoChamberItem[];
	indeks_timeseries?: IndeksTimeItem[];
	summary?: SummaryItem[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const VALID_EXT = [".md", ".mdx"];

function isContentFile(file: string): boolean {
	return VALID_EXT.some((ext) => file.toLowerCase().endsWith(ext));
}

function slugFromFile(file: string): string {
	for (const ext of VALID_EXT) {
		if (file.toLowerCase().endsWith(ext)) return file.slice(0, -ext.length).toLowerCase();
	}
	return file.toLowerCase();
}

function buildCandidatePaths(slug: string): string[] {
	return VALID_EXT.flatMap((ext) => [
		path.join(ARTIKEL_DIR, `${slug}${ext}`),
		path.join(ARTIKEL_DIR, slug),
	]);
}

/** Build empty analysis with defaults */
function emptyAnalysis(): ArticleAnalysisData {
	return {
		ringkasan: [],
		tren_harian: [],
		narasi: [],
		narasi_detail: [],
		narasi_komentar: [],
		keywords: { positif: [], negatif: [], netral: [] },
		entitas: [],
		indeks: { skor: 0, kategori: "Belum ada", sentimen: 0, stance: 0 },
		platforms: [],
		stance_platform: [],
		eskalasi: [],
		momentum_shifts: [],
		echo_chamber: [],
		indeks_timeseries: [],
		summary: [],
	};
}

/** Parse a single content file → ArticleData */
function parseContentFile(filePath: string): ArticleData | null {
	const raw = fs.readFileSync(filePath, "utf-8");
	const { data, content } = matter(raw);
	const fm = data as MdFrontmatter;

	const slug = slugFromFile(path.basename(filePath));
	if (!fm.title) return null;

	const readTime = fm.readTime ?? Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));

	// Build analysis data from frontmatter (with fallback to empty arrays)
	const analysis: ArticleAnalysisData = {
		ringkasan: fm.ringkasan ?? [],
		tren_harian: fm.tren_harian ?? [],
		narasi: fm.narasi ?? [],
		narasi_detail: fm.narasi_detail ?? [],
		narasi_komentar: fm.narasi_komentar ?? [],
		keywords: fm.keywords ?? { positif: [], negatif: [], netral: [] },
		entitas: fm.entitas ?? [],
		indeks: fm.indeks ?? { skor: 0, kategori: "Belum ada", sentimen: 0, stance: 0 },
		platforms: fm.platforms ?? [],
		stance_platform: fm.stance_platform ?? [],
		eskalasi: fm.eskalasi ?? [],
		momentum_shifts: fm.momentum_shifts ?? [],
		echo_chamber: fm.echo_chamber ?? [],
		indeks_timeseries: fm.indeks_timeseries ?? [],
		summary: fm.summary ?? [],
	};

	// Build konten: 13 bagian dipisah pake ||| (ArticleBody butuh format ini)
	// Dibaca dari: body (split by <!--bagian-->) atau frontmatter parts[] atau ||| di body
	let konten: string;
	if (fm.parts && fm.parts.length > 0) {
		// Frontmatter: YAML array parts[0..12]
		konten = fm.parts.join("|||");
	} else if (content.includes("<!--bagian-->")) {
		// Body: HTML comment sebagai separator
		konten = content.split(/<!--bagian-->/g).map((s) => s.trim()).join("|||");
	} else {
		// Fallback: body langsung dipisah |||
		konten = content;
	}

	return {
		slug,
		title: fm.title,
		description: fm.description || "",
		konten,
		thumbnail: fm.thumbnail || "",
		kategori: fm.kategori || "Umum",
		kata_kunci: fm.kata_kunci || "",
		date: fm.date || "",
		readTime,
		analysis,
	};
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function getAllArticles(): ArticleListItem[] {
	if (!fs.existsSync(ARTIKEL_DIR)) return [];
	const files = fs.readdirSync(ARTIKEL_DIR).filter(isContentFile);
	const articles: ArticleListItem[] = [];
	for (const file of files) {
		const art = parseContentFile(path.join(ARTIKEL_DIR, file));
		if (art) {
			articles.push({
				slug: art.slug,
				title: art.title,
				description: art.description,
				thumbnail: art.thumbnail,
				kategori: art.kategori,
				date: art.date,
			});
		}
	}
	return articles.sort((a, b) => {
		if (!a.date) return 1;
		if (!b.date) return -1;
		return b.date.localeCompare(a.date);
	});
}

export function getMdArticle(slug: string): ArticleData | null {
	if (!fs.existsSync(ARTIKEL_DIR)) return null;
	for (const filePath of buildCandidatePaths(slug)) {
		if (fs.existsSync(filePath) && isContentFile(filePath)) return parseContentFile(filePath);
	}
	return null;
}

export function getAllSlugs(): string[] {
	if (!fs.existsSync(ARTIKEL_DIR)) return [];
	return fs.readdirSync(ARTIKEL_DIR).filter(isContentFile).map((f) => slugFromFile(f));
}

// ─── MD-Based queries (replacement for lib/query.ts DB functions) ────────────

/** Get unique categories from all articles */
export function getMdKategori(): string[] {
	const cats = new Set(
		getAllArticles()
			.map((a) => a.kategori)
			.filter(Boolean),
	);
	return Array.from(cats).sort();
}

/** Get latest articles as trending (no DB needed — just sorted by date) */
export function getMdTrending(limit = 10): TrendingItemCompat[] {
	return getAllArticles().slice(0, limit).map((a) => ({
		title: a.title,
		date: a.date,
		slug: a.slug,
		thumbnail: a.thumbnail || undefined,
	}));
}

/** Compat type for TrendingItem from lib/query */
interface TrendingItemCompat {
	title: string;
	date: string;
	slug: string;
	thumbnail?: string;
}

/** Paginated article list — offset-based, compatible dengan IsuListItem type */
export interface PaginatedMdResult {
	data: IsuListItemCompat[];
	nextOffset: number | null;
}

/** Compat type for IsuListItem from lib/query */
interface IsuListItemCompat {
	slug: string;
	title: string;
	description: string;
	thumbnail: string;
	kategori: string;
	date: string;
}

export function getMdArticleListPaginated(
	kategori?: string,
	search?: string,
	limit = 10,
	offset = 0,
): PaginatedMdResult {
	let articles = getAllArticles();

	if (kategori && kategori !== "Untuk Anda") {
		articles = articles.filter((a) => a.kategori === kategori);
	}
	if (search) {
		const q = search.toLowerCase();
		articles = articles.filter(
			(a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q),
		);
	}

	const total = articles.length;
	const data = articles.slice(offset, offset + limit);
	const nextOffset = offset + limit < total ? offset + limit : null;

	return {
		data: data.map((a) => ({
			slug: a.slug,
			title: a.title,
			description: a.description,
			thumbnail: a.thumbnail,
			kategori: a.kategori,
			date: a.date,
		})),
		nextOffset,
	};
}
