import { Prisma } from "@prisma/client";

type TxClient = Prisma.TransactionClient;

/** Convert date string to Date object, pass through if already Date */
const toDate = (v: unknown) => (v ? new Date(v as string) : null);

/** Simple field mapper — maps body fields to Prisma data, skipping undefined */
export function mapFields(body: Record<string, any>, fieldDefs: Record<string, (v: any) => any>): Record<string, any> {
	const data: Record<string, any> = {};
	for (const [key, transform] of Object.entries(fieldDefs)) {
		if (body[key] !== undefined) data[key] = transform(body[key]);
	}
	return data;
}

/** Delete all child rows for an isu_id, then create new ones */
export async function replaceIsuChildren(
	tx: TxClient,
	modelName: string,
	isu_id: string,
	items: any[],
	fieldDefs: Record<string, (v: any) => any>,
	extra: Record<string, any> = {}
) {
	const model = (tx as any)[modelName] as any;
	await model.deleteMany({ where: { isu_id } });
	if (items.length > 0) {
		await model.createMany({ data: items.map((item) => ({ isu_id, ...extra, ...mapFields(item, fieldDefs) })) });
	}
}

/** Create child rows for an isu_id (no delete) */
export async function createIsuChildren(
	tx: TxClient,
	modelName: string,
	isu_id: string,
	items: any[],
	fieldDefs: Record<string, (v: any) => any>,
	extra: Record<string, any> = {}
) {
	if (items.length === 0) return;
	const model = (tx as any)[modelName] as any;
	await model.createMany({ data: items.map((item) => ({ isu_id, ...extra, ...mapFields(item, fieldDefs) })) });
}

// ── Field definitions for all Isu child tables ──────────────────────────────

const pct = (v: any) => v ?? null;
const int = (v: any) => v || 0;
const str = (v: any) => v ?? null;
const req = (v: any) => v;

export const CHILD_FIELD_DEFS = {
	trenHarian: {
		platform: (v: any) => v || "all",
		tanggal: toDate,
		total_komentar: int,
		jml_positif: int,
		jml_negatif: int,
		jml_netral: int,
		pct_positif: pct,
		pct_negatif: pct,
		pct_netral: pct,
	} satisfies Record<string, (v: any) => any>,

	reaksiPlatform: {
		platform: req,
		tanggal: toDate,
		total_komentar: int,
		pct_positif: pct,
		pct_negatif: pct,
		pct_netral: pct,
		pct_mendukung: pct,
		pct_menolak: pct,
		pct_netral_stance: pct,
		dominant_emosi: str,
		toxic_rate: pct,
		sarkasme_rate: pct,
	} satisfies Record<string, (v: any) => any>,

	eskalasi: {
		platform: str,
		tanggal: toDate,
		delta_negatif: str,
		delta_pct: pct,
		level: str,
		is_eskalasi: (v: any) => v || false,
	} satisfies Record<string, (v: any) => any>,

	momentumShift: {
		tanggal: toDate,
		sentimen_sebelum: str,
		sentimen_sesudah: str,
		magnitude: pct,
		keterangan: str,
	} satisfies Record<string, (v: any) => any>,

	echoChamber: {
		platform: str,
		tanggal: toDate,
		variance_sentimen: pct,
		variance_stance: pct,
		is_echo_chamber: (v: any) => v || false,
		keterangan: str,
	} satisfies Record<string, (v: any) => any>,

	indeksKepercayaan: {
		tanggal: toDate,
		skor_sentimen: pct,
		skor_stance: pct,
		skor_eskalasi: pct,
		indeks_final: pct,
		kategori: str,
	} satisfies Record<string, (v: any) => any>,

	narasi: {
		tanggal: toDate,
		narasi_ke: str,
		kata_kunci: str,
		jumlah_komentar: str,
		persentase: pct,
		contoh_komentar: str,
	} satisfies Record<string, (v: any) => any>,

	entitasAgregat: {
		tanggal: toDate,
		tipe: str,
		nilai: req,
		jumlah: int,
	} satisfies Record<string, (v: any) => any>,

	keywordHarian: {
		tanggal: toDate,
		sentimen: str,
		kata: req,
		frekuensi: int,
		skor_tfidf: pct,
	} satisfies Record<string, (v: any) => any>,

	summaryIsu: {
		tanggal: toDate,
		periode: str,
		judul: str,
		konten: str,
		editor: str,
	} satisfies Record<string, (v: any) => any>,
};

/** All child table configs for Isu — only MANUAL tables (from IndoBERT).
 *  Derived tables (tren_harian, reaksi_platform, eskalasi, momentum_shift,
 *  echo_chamber, indeks_kepercayaan, entitas_agregat) are auto-calculated
 *  via lib/recalculate.ts on Postingan changes. */
export const ISU_CHILD_TABLES = [
	{ key: "narasi", model: "narasi", defs: CHILD_FIELD_DEFS.narasi },
	{ key: "keyword_harian", model: "keywordHarian", defs: CHILD_FIELD_DEFS.keywordHarian },
	{ key: "summary_isu", model: "summaryIsu", defs: CHILD_FIELD_DEFS.summaryIsu },
] as const;

/** Create Komentar rows with nested Analisis (1:1) and Entitas (many) */
export async function createKomentarBatch(
	tx: TxClient,
	postingan_id: string,
	komentarList: any[]
) {
	for (const k of komentarList) {
		if (!k.teks) continue;
		const komentar = await tx.komentar.create({
			data: {
				postingan_id,
				username: k.username ?? null,
				teks: k.teks,
				tanggal: k.tanggal ? new Date(k.tanggal) : null,
			},
		});
		if (k.analisis) {
			await tx.analisis.create({
				data: {
					komentar_id: komentar.id,
					...mapFields(k.analisis, {
						sentimen: str, emosi: str, stance: str, intensitas: str,
						is_sarkasme: (v: any) => v || false,
						is_toxic: (v: any) => v || false,
						conf_sentimen: pct, conf_emosi: pct, conf_stance: pct, conf_intensitas: pct,
					}),
				},
			});
		}
		if (k.entitas?.length > 0) {
			await tx.entitas.createMany({
				data: k.entitas.map((e: any) => ({
					komentar_id: komentar.id,
					tipe: e.tipe ?? null,
					nilai: e.nilai,
				})),
			});
		}
	}
}
