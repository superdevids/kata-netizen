// ─── TYPES ONLY — All DB functions have been replaced by MD-based functions in lib/md-loader.ts

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

export interface TrendingItem {
	title: string;
	date: string;
	slug: string;
	thumbnail?: string;
}
