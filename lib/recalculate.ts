import type { PrismaClient } from "@prisma/client";

type TxClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

// ── Helpers ──────────────────────────────────────────────────────────────────

const toNum = (v: any): number => (v != null ? Number(v) : 0);
const round2 = (v: number): number => Math.round(v * 100) / 100;
const round4 = (v: number): number => Math.round(v * 10000) / 10000;

const sentimenNum = (s: string | null | undefined): number => {
	if (s === "positif") return 1;
	if (s === "negatif") return -1;
	return 0;
};

const stanceNum = (s: string | null | undefined): number => {
	if (s === "mendukung") return 1;
	if (s === "menolak") return -1;
	return 0;
};

const dateKey = (d: Date): string => {
	const dt = new Date(d);
	return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

// ── Shared types for passing computed data between recalculators ────────────

interface TrenHarianRow {
	platform: string;
	tanggal: Date;
	total_komentar: number;
	jml_positif: number;
	jml_negatif: number;
	jml_netral: number;
	pct_positif: number | null;
	pct_negatif: number | null;
	pct_netral: number | null;
}

interface ReaksiPlatformRow {
	platform: string;
	tanggal: Date;
	pct_mendukung: number | null;
	[key: string]: any;
}

interface EskalasiRow {
	tanggal: Date;
	delta_pct: number;
	[key: string]: any;
}

// ── 1. TrenHarian ────────────────────────────────────────────────────────────

async function recalculateTrenHarian(tx: TxClient, isu_id: string, rows: RawRow[]): Promise<TrenHarianRow[]> {
	const groups = new Map<string, { platform: string; tanggal: Date; total: number; pos: number; neg: number; net: number }>();

	for (const row of rows) {
		const key = `${row.platform}|${dateKey(row.tanggal)}`;
		if (!groups.has(key)) groups.set(key, { platform: row.platform, tanggal: row.tanggal, total: 0, pos: 0, neg: 0, net: 0 });
		const g = groups.get(key)!;
		g.total++;
		if (row.sentimen === "positif") g.pos++;
		else if (row.sentimen === "negatif") g.neg++;
		else g.net++;
	}

	await tx.trenHarian.deleteMany({ where: { isu_id } });

	const result: TrenHarianRow[] = Array.from(groups.values()).map((g) => ({
		platform: g.platform,
		tanggal: g.tanggal,
		total_komentar: g.total,
		jml_positif: g.pos,
		jml_negatif: g.neg,
		jml_netral: g.net,
		pct_positif: g.total > 0 ? round2((g.pos / g.total) * 100) : null,
		pct_negatif: g.total > 0 ? round2((g.neg / g.total) * 100) : null,
		pct_netral: g.total > 0 ? round2((g.net / g.total) * 100) : null,
	}));

	if (result.length > 0) {
		await tx.trenHarian.createMany({
			data: result.map((r) => ({ isu_id, ...r })),
		});
	}

	return result;
}

// ── 2. ReaksiPlatform ────────────────────────────────────────────────────────

async function recalculateReaksiPlatform(tx: TxClient, isu_id: string, rows: RawRow[]): Promise<ReaksiPlatformRow[]> {
	const groups = new Map<string, {
		platform: string; tanggal: Date;
		total: number; pos: number; neg: number; net: number;
		mendukung: number; menolak: number; netralSt: number;
		emosiCount: Map<string, number>; toxic: number; sarkasme: number;
	}>();

	for (const row of rows) {
		const key = `${row.platform}|${dateKey(row.tanggal)}`;
		if (!groups.has(key)) {
			groups.set(key, {
				platform: row.platform, tanggal: row.tanggal,
				total: 0, pos: 0, neg: 0, net: 0,
				mendukung: 0, menolak: 0, netralSt: 0,
				emosiCount: new Map(), toxic: 0, sarkasme: 0,
			});
		}
		const g = groups.get(key)!;
		g.total++;
		if (row.sentimen === "positif") g.pos++;
		else if (row.sentimen === "negatif") g.neg++;
		else g.net++;
		if (row.stance === "mendukung") g.mendukung++;
		else if (row.stance === "menolak") g.menolak++;
		else g.netralSt++;
		if (row.emosi) g.emosiCount.set(row.emosi, (g.emosiCount.get(row.emosi) || 0) + 1);
		if (row.is_toxic) g.toxic++;
		if (row.is_sarkasme) g.sarkasme++;
	}

	await tx.reaksiPlatform.deleteMany({ where: { isu_id } });

	const result: ReaksiPlatformRow[] = Array.from(groups.values()).map((g) => {
		let dominant_emosi: string | null = null;
		let maxEmosi = 0;
		for (const [e, c] of g.emosiCount) {
			if (c > maxEmosi) { maxEmosi = c; dominant_emosi = e; }
		}
		return {
			platform: g.platform,
			tanggal: g.tanggal,
			total_komentar: g.total,
			pct_positif: g.total > 0 ? round2((g.pos / g.total) * 100) : null,
			pct_negatif: g.total > 0 ? round2((g.neg / g.total) * 100) : null,
			pct_netral: g.total > 0 ? round2((g.net / g.total) * 100) : null,
			pct_mendukung: g.total > 0 ? round2((g.mendukung / g.total) * 100) : null,
			pct_menolak: g.total > 0 ? round2((g.menolak / g.total) * 100) : null,
			pct_netral_stance: g.total > 0 ? round2((g.netralSt / g.total) * 100) : null,
			dominant_emosi,
			toxic_rate: g.total > 0 ? round2((g.toxic / g.total) * 100) : null,
			sarkasme_rate: g.total > 0 ? round2((g.sarkasme / g.total) * 100) : null,
		};
	});

	if (result.length > 0) {
		await tx.reaksiPlatform.createMany({
			data: result.map((r) => ({ isu_id, ...r })),
		});
	}

	return result;
}

// ── 3. Eskalasi ──────────────────────────────────────────────────────────────
// Accepts pre-computed trenHarian data instead of re-querying DB

async function recalculateEskalasi(tx: TxClient, isu_id: string, trenData: TrenHarianRow[]): Promise<EskalasiRow[]> {
	const byPlatform = new Map<string, TrenHarianRow[]>();
	for (const t of trenData) {
		if (!byPlatform.has(t.platform)) byPlatform.set(t.platform, []);
		byPlatform.get(t.platform)!.push(t);
	}

	// Sort each platform's data by date ascending
	for (const list of byPlatform.values()) {
		list.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
	}

	await tx.eskalasi.deleteMany({ where: { isu_id } });

	const rows: EskalasiRow[] = [];
	for (const [, trenList] of byPlatform) {
		for (let i = 1; i < trenList.length; i++) {
			const prev = trenList[i - 1];
			const curr = trenList[i];
			const delta_negatif = curr.jml_negatif - prev.jml_negatif;
			const delta_pct = toNum(curr.pct_negatif) - toNum(prev.pct_negatif);
			const abs_delta = Math.abs(delta_pct);
			const level = abs_delta < 2 ? "rendah" : abs_delta < 5 ? "sedang" : abs_delta < 10 ? "tinggi" : "kritis";
			rows.push({
				platform: curr.platform,
				tanggal: curr.tanggal,
				delta_negatif,
				delta_pct: round2(delta_pct),
				level,
				is_eskalasi: abs_delta >= 5,
			});
		}
	}

	if (rows.length > 0) await tx.eskalasi.createMany({ data: rows.map((r) => ({ isu_id, ...r })) });

	return rows;
}

// ── 4. MomentumShift ─────────────────────────────────────────────────────────
// Accepts pre-computed trenHarian data instead of re-querying DB

async function recalculateMomentumShift(tx: TxClient, isu_id: string, trenData: TrenHarianRow[]) {
	await tx.momentumShift.deleteMany({ where: { isu_id } });

	// Aggregate across platforms per date
	const byDate = new Map<string, { tanggal: Date; pos: number; neg: number; net: number; total: number }>();
	for (const t of trenData) {
		const key = dateKey(t.tanggal);
		if (!byDate.has(key)) byDate.set(key, { tanggal: t.tanggal, pos: 0, neg: 0, net: 0, total: 0 });
		const g = byDate.get(key)!;
		g.pos += t.jml_positif;
		g.neg += t.jml_negatif;
		g.net += t.jml_netral;
		g.total += t.total_komentar;
	}

	const sorted = Array.from(byDate.values()).sort(
		(a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
	);

	const rows: any[] = [];
	for (let i = 1; i < sorted.length; i++) {
		const prev = sorted[i - 1];
		const curr = sorted[i];
		const prevNet = prev.total > 0 ? (prev.pos - prev.neg) / prev.total : 0;
		const currNet = curr.total > 0 ? (curr.pos - curr.neg) / curr.total : 0;
		const magnitude = Math.abs(currNet - prevNet);

		if (magnitude >= 0.1) {
			const dominant = (g: typeof prev) => (g.pos >= g.neg && g.pos >= g.net ? "positif" : g.neg >= g.pos && g.neg >= g.net ? "negatif" : "netral");
			rows.push({
				isu_id,
				tanggal: curr.tanggal,
				sentimen_sebelum: dominant(prev),
				sentimen_sesudah: dominant(curr),
				magnitude: round4(magnitude),
				keterangan: `Pergeseran sentimen dengan magnitudo ${round4(magnitude)}`,
			});
		}
	}

	if (rows.length > 0) await tx.momentumShift.createMany({ data: rows });
}

// ── 5. EchoChamber ───────────────────────────────────────────────────────────

async function recalculateEchoChamber(tx: TxClient, isu_id: string, rows: RawRow[]) {
	const groups = new Map<string, { platform: string; tanggal: Date; sentimenVals: number[]; stanceVals: number[] }>();

	for (const row of rows) {
		const key = `${row.platform}|${dateKey(row.tanggal)}`;
		if (!groups.has(key)) groups.set(key, { platform: row.platform, tanggal: row.tanggal, sentimenVals: [], stanceVals: [] });
		const g = groups.get(key)!;
		g.sentimenVals.push(sentimenNum(row.sentimen));
		g.stanceVals.push(stanceNum(row.stance));
	}

	await tx.echoChamber.deleteMany({ where: { isu_id } });

	const variance = (arr: number[]): number => {
		if (arr.length === 0) return 0;
		const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
		return arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
	};

	const newRows: any[] = [];
	for (const g of groups.values()) {
		const vs = round4(variance(g.sentimenVals));
		const vst = round4(variance(g.stanceVals));
		newRows.push({
			isu_id,
			platform: g.platform,
			tanggal: g.tanggal,
			variance_sentimen: vs,
			variance_stance: vst,
			is_echo_chamber: vs < 0.05 && vst < 0.05,
			keterangan: vs < 0.05 && vst < 0.05 ? "Echo chamber terdeteksi" : null,
		});
	}

	if (newRows.length > 0) await tx.echoChamber.createMany({ data: newRows });
}

// ── 6. IndeksKepercayaan ─────────────────────────────────────────────────────
// Accepts pre-computed trenHarian, eskalasi, and reaksiPlatform data

async function recalculateIndeksKepercayaan(
	tx: TxClient,
	isu_id: string,
	trenData: TrenHarianRow[],
	eskalasiData: EskalasiRow[],
	reaksiData: ReaksiPlatformRow[]
) {
	await tx.indeksKepercayaan.deleteMany({ where: { isu_id } });

	// Aggregate sentimen percentages per date from TrenHarian
	const byDate = new Map<string, { tanggal: Date; pctPosSum: number; count: number; eskalasiPct: number }>();
	for (const t of trenData) {
		const key = dateKey(t.tanggal);
		if (!byDate.has(key)) byDate.set(key, { tanggal: t.tanggal, pctPosSum: 0, count: 0, eskalasiPct: 0 });
		const g = byDate.get(key)!;
		g.pctPosSum += toNum(t.pct_positif);
		g.count++;
	}

	// Sum up eskalasi delta_pct per date as severity indicator
	for (const e of eskalasiData) {
		const key = dateKey(e.tanggal);
		if (byDate.has(key)) byDate.get(key)!.eskalasiPct += Math.abs(toNum(e.delta_pct));
	}

	// Build stance data from pre-computed reaksiPlatform
	const stanceByDate = new Map<string, { sum: number; count: number }>();
	for (const r of reaksiData) {
		const key = dateKey(r.tanggal);
		if (!stanceByDate.has(key)) stanceByDate.set(key, { sum: 0, count: 0 });
		const g = stanceByDate.get(key)!;
		g.sum += toNum(r.pct_mendukung);
		g.count++;
	}

	const newRows: any[] = [];
	for (const g of byDate.values()) {
		const skor_sentimen = g.count > 0 ? round2(g.pctPosSum / g.count) : 0;
		const stanceInfo = stanceByDate.get(dateKey(g.tanggal));
		const skor_stance = stanceInfo && stanceInfo.count > 0 ? round2(stanceInfo.sum / stanceInfo.count) : 50;
		const skor_eskalasi = round2(Math.max(0, Math.min(100, 100 - g.eskalasiPct * 10)));
		const indeks_final = round2((skor_sentimen + skor_stance + skor_eskalasi) / 3);
		const kategori = indeks_final >= 65 ? "tinggi" : indeks_final >= 40 ? "sedang" : "rendah";

		newRows.push({
			isu_id,
			tanggal: g.tanggal,
			skor_sentimen,
			skor_stance,
			skor_eskalasi,
			indeks_final,
			kategori,
		});
	}

	if (newRows.length > 0) await tx.indeksKepercayaan.createMany({ data: newRows });
}

// ── 7. EntitasAgregat ────────────────────────────────────────────────────────

async function recalculateEntitasAgregat(tx: TxClient, isu_id: string, entitasRows: EntityRow[]) {
	const groups = new Map<string, { tanggal: Date; tipe: string | null; nilai: string; jumlah: number }>();

	for (const e of entitasRows) {
		const key = `${dateKey(e.tanggal)}|${e.tipe ?? ""}|${e.nilai}`;
		if (!groups.has(key)) groups.set(key, { tanggal: e.tanggal, tipe: e.tipe, nilai: e.nilai, jumlah: 0 });
		groups.get(key)!.jumlah++;
	}

	await tx.entitasAgregat.deleteMany({ where: { isu_id } });

	if (groups.size > 0) {
		await tx.entitasAgregat.createMany({
			data: Array.from(groups.values()).map((g) => ({
				isu_id,
				tanggal: g.tanggal,
				tipe: g.tipe,
				nilai: g.nilai,
				jumlah: g.jumlah,
			})),
		});
	}
}

// ── Types ────────────────────────────────────────────────────────────────────

interface RawRow {
	platform: string;
	tanggal: Date;
	sentimen: string | null;
	emosi: string | null;
	stance: string | null;
	is_toxic: boolean;
	is_sarkasme: boolean;
}

interface EntityRow {
	tanggal: Date;
	tipe: string | null;
	nilai: string;
}

// ── Main entry ───────────────────────────────────────────────────────────────

async function recalculateIsuAnalytics(tx: TxClient, isu_id: string) {
	// Fetch all Komentar + Analisis for this Isu, joining through Postingan for platform
	const postinganList = await tx.postingan.findMany({
		where: { isu_id },
		include: {
			komentar: { include: { analisis: true } },
		},
	});

	// Flatten into raw rows for aggregation
	const rows: RawRow[] = [];
	for (const p of postinganList) {
		for (const k of p.komentar) {
			rows.push({
				platform: p.platform,
				tanggal: k.tanggal ?? p.tanggal_post ?? new Date(),
				sentimen: k.analisis?.sentimen ?? null,
				emosi: k.analisis?.emosi ?? null,
				stance: k.analisis?.stance ?? null,
				is_toxic: k.analisis?.is_toxic ?? false,
				is_sarkasme: k.analisis?.is_sarkasme ?? false,
			});
		}
	}

	// Fetch all Entitas for EntitasAgregat
	const allKomentarIds = postinganList.flatMap((p) => p.komentar.map((k) => k.id));
	let entitasRows: EntityRow[] = [];
	if (allKomentarIds.length > 0) {
		const entitas = await tx.entitas.findMany({
			where: { komentar_id: { in: allKomentarIds } },
			include: { komentar: { select: { tanggal: true, postingan: { select: { tanggal_post: true } } } } },
		});
		entitasRows = entitas.map((e) => ({
			tanggal: e.komentar.tanggal ?? e.komentar.postingan.tanggal_post ?? new Date(),
			tipe: e.tipe,
			nilai: e.nilai,
		}));
	}

	// Phase 1: Run independent recalculators in parallel (TrenHarian, ReaksiPlatform, EchoChamber, EntitasAgregat)
	const [trenData, reaksiData] = await Promise.all([
		recalculateTrenHarian(tx, isu_id, rows),
		recalculateReaksiPlatform(tx, isu_id, rows),
		recalculateEchoChamber(tx, isu_id, rows),
		recalculateEntitasAgregat(tx, isu_id, entitasRows),
	]);

	// Phase 2: Run TrenHarian-dependent recalculators in parallel (Eskalasi, MomentumShift)
	const eskalasiData = await recalculateEskalasi(tx, isu_id, trenData);
	await recalculateMomentumShift(tx, isu_id, trenData);

	// Phase 3: IndeksKepercayaan depends on TrenHarian + Eskalasi + ReaksiPlatform
	await recalculateIndeksKepercayaan(tx, isu_id, trenData, eskalasiData, reaksiData);
}

// ── 8. PerbandinganIsu (correlations for registered pairs) ──────────────────

function pearson(xs: number[], ys: number[]): number | null {
	const n = xs.length;
	if (n < 2) return null;
	const mx = xs.reduce((a, b) => a + b, 0) / n;
	const my = ys.reduce((a, b) => a + b, 0) / n;
	let num = 0, dx = 0, dy = 0;
	for (let i = 0; i < n; i++) {
		const a = xs[i] - mx, b = ys[i] - my;
		num += a * b; dx += a * a; dy += b * b;
	}
	const denom = Math.sqrt(dx * dy);
	return denom === 0 ? 0 : round4(num / denom);
}

async function recalculatePerbandinganIsu(tx: TxClient, isu_id: string) {
	const pairs = await tx.perbandinganIsu.findMany({
		where: { OR: [{ isu_a_id: isu_id }, { isu_b_id: isu_id }] },
	});
	if (pairs.length === 0) return;

	// Fetch all TrenHarian for all involved isu_ids
	const involvedIds = new Set<string>();
	for (const p of pairs) { involvedIds.add(p.isu_a_id); involvedIds.add(p.isu_b_id); }

	const trenAll = await tx.trenHarian.findMany({
		where: { isu_id: { in: [...involvedIds] } },
	});

	// Group by isu_id -> dateKey -> aggregated pct_positif & stance proxy
	const trenMap = new Map<string, Map<string, { pctPos: number; stanceScore: number }>>();
	for (const t of trenAll) {
		if (!trenMap.has(t.isu_id)) trenMap.set(t.isu_id, new Map());
		const m = trenMap.get(t.isu_id)!;
		const key = dateKey(t.tanggal);
		const prev = m.get(key);
		const pctPos = toNum(t.pct_positif);
		const stanceScore = t.total_komentar > 0
			? round2(((toNum(t.jml_positif) - toNum(t.jml_negatif)) / t.total_komentar) * 100)
			: 0;
		if (prev) {
			// Average across platforms for same date
			prev.pctPos = (prev.pctPos + pctPos) / 2;
			prev.stanceScore = (prev.stanceScore + stanceScore) / 2;
		} else {
			m.set(key, { pctPos, stanceScore });
		}
	}

	for (const pair of pairs) {
		const mapA = trenMap.get(pair.isu_a_id) ?? new Map();
		const mapB = trenMap.get(pair.isu_b_id) ?? new Map();

		// Find overlapping dates
		const commonDates = [...mapA.keys()].filter((d) => mapB.has(d)).sort();

		const korelasi_sentimen = commonDates.length >= 2
			? pearson(
				commonDates.map((d) => mapA.get(d)!.pctPos),
				commonDates.map((d) => mapB.get(d)!.pctPos)
			)
			: null;

		const korelasi_stance = commonDates.length >= 2
			? pearson(
				commonDates.map((d) => mapA.get(d)!.stanceScore),
				commonDates.map((d) => mapB.get(d)!.stanceScore)
			)
			: null;

		// Build keterangan
		let keterangan = pair.keterangan;
		if (korelasi_sentimen !== null) {
			const strength = Math.abs(korelasi_sentimen) >= 0.7 ? "kuat" : Math.abs(korelasi_sentimen) >= 0.4 ? "sedang" : "lemah";
			const direction = korelasi_sentimen >= 0 ? "positif" : "negatif";
			keterangan = `Korelasi sentimen ${strength} ${direction} (${korelasi_sentimen}) berdasarkan ${commonDates.length} hari data`;
		}

		await tx.perbandinganIsu.update({
			where: { id: pair.id },
			data: { korelasi_sentimen, korelasi_stance, keterangan },
		});
	}
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Call after any Postingan create/update/delete to refresh all derived analytics */
export async function recalculateOnPostinganChange(tx: TxClient, postingan_id: string) {
	const postingan = await tx.postingan.findUnique({ where: { id: postingan_id } });
	if (!postingan) return;
	await recalculateIsuAnalytics(tx, postingan.isu_id);
	await recalculatePerbandinganIsu(tx, postingan.isu_id);
}

/** Call after Postingan DELETE (before the row is removed, pass isu_id directly) */
export async function recalculateIsuById(tx: TxClient, isu_id: string) {
	await recalculateIsuAnalytics(tx, isu_id);
	await recalculatePerbandinganIsu(tx, isu_id);
}

/** Recalculate correlations for all registered pairs involving isu_id */
export { recalculatePerbandinganIsu };
