import { prisma } from "./prisma";

const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export async function getKategori(): Promise<string[]> {
	const hasil = await prisma.isu.findMany({
		where: { aktif: true },
		select: { kategori: true },
		distinct: ["kategori"],
		orderBy: { kategori: "asc" },
	});
	return hasil.map((i) => i.kategori).filter((k): k is string => k !== null);
}

export async function getIsu(kategori?: string) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const data = await prisma.isu.findMany({
		where: {
			aktif: true,
			summary_isu: {
				some: {},
			},
			...(kategori && kategori !== "Untuk Anda" ? { kategori } : {}),
		},
		orderBy: { created_at: "desc" },
		take: 20,
		select: {
			id: true,
			judul: true,
			deskripsi: true,
			thumbnail: true,
			kategori: true,
			created_at: true,
		},
	});
	return data.map((i) => {
		const d = new Date(i.created_at);
		return {
			slug: i.id,
			date: `${String(d.getDate()).padStart(2, "0")} ${bulan[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`,
			title: i.judul,
			description: i.deskripsi,
			thumbnail: i.thumbnail,
			kategori: i.kategori,
		};
	});
}

export async function getIsuById(id: string) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const i = await prisma.isu.findUnique({
		where: {
			id,
			// aktif: true,
			// summary_isu: {
			// 	some: {},
			// },
		},
		// include: {
		// 	tren_harian: {
		// 		where: {
		// 			platform: "all",
		// 			tanggal: today,
		// 		},
		// 		take: 1,
		// 	},
		// 	indeks_kepercayaan: {
		// 		where: { tanggal: today },
		// 		take: 1,
		// 	},
		// },
		select: {
			id: true,
			judul: true,
			deskripsi: true,
			konten: true,
			thumbnail: true,
			kategori: true,
			kata_kunci: true,
			updated_at: true,
		},
	});
	if (!i) return null;
	const d = new Date(i.updated_at);
	return {
		slug: i.id,
		date: `${String(d.getDate()).padStart(2, "0")} ${bulan[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`,
		title: i.judul,
		description: i.deskripsi,
		konten: i.konten,
		thumbnail: i.thumbnail,
		kategori: i.kategori,
		kata_kunci: i.kata_kunci,
		// total_komentar: i?.tren_harian[0]?.total_komentar ?? 0,
		// indeks: Number(i?.indeks_kepercayaan[0]?.indeks_final) ?? null,
		// kategori_indeks: i?.indeks_kepercayaan[0]?.kategori ?? null,
	};
}
