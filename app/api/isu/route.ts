import { NextRequest } from "next/server";
import { getIsuList, getKategori } from "@/lib/query";
import { prisma } from "@/lib/prisma";
import { createIsuChildren, ISU_CHILD_TABLES } from "@/lib/api-helpers";
import { checkAuth, isAdmin } from "@/lib/auth";
import { invalidateListCache } from "@/lib/cache";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const kategori = searchParams.get("kategori") || undefined;
	const search = searchParams.get("search") || undefined;
	const admin = isAdmin(request);
	const [isu, kategoriList] = await Promise.all([getIsuList(kategori, search, admin), getKategori(admin)]);
	return Response.json({ isu, kategoriList });
}

export async function POST(request: NextRequest) {
	try {
		const authErr = checkAuth(request);
		if (authErr) return authErr;

		const body = await request.json();
		const { slug, judul, deskripsi, konten, thumbnail, kategori, kata_kunci, aktif = true, is_draft = true } = body;

		if (!judul || !deskripsi || !konten || !thumbnail || !kategori || !kata_kunci) {
			return Response.json({ error: "Missing required fields: judul, deskripsi, konten, thumbnail, kategori, kata_kunci" }, { status: 400 });
		}

		const result = await prisma.$transaction(async (tx) => {
			const isu = await tx.isu.create({
				data: { slug: slug || undefined, judul, deskripsi, konten, thumbnail, kategori, kata_kunci, aktif, is_draft },
			});

			for (const { key, model, defs } of ISU_CHILD_TABLES) {
				await createIsuChildren(tx, model, isu.id, body[key] || [], defs);
			}

			// Auto-register PerbandinganIsu pairs with all existing Isu
			const existingIsu = await tx.isu.findMany({
				where: { id: { not: isu.id } },
				select: { id: true },
			});
			if (existingIsu.length > 0) {
				const today = new Date();
				const pairs = existingIsu.map((other) => ({
					isu_a_id: other.id,
					isu_b_id: isu.id,
					tanggal: today,
				}));
				await tx.perbandinganIsu.createMany({ data: pairs });
			}

			return isu;
		});

		// Only notify subscribers if created as published (non-draft)
		if (!result.is_draft) {
			import("@/lib/email").then(({ notifySubscribers }) => {
				notifySubscribers(result).catch(() => {
					// Silently handle newsletter notification errors
				});
			});
		}

		// Invalidate list caches when new Isu is created
		invalidateListCache();

		return Response.json({ success: true, data: result }, { status: 201 });
	} catch (err: any) {
		if (err.code === "P2002") return Response.json({ error: "Slug already exists" }, { status: 409 });
		return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
	}
}
