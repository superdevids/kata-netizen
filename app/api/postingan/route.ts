import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createKomentarBatch } from "@/lib/api-helpers";
import { recalculateOnPostinganChange } from "@/lib/recalculate";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const isu_id = searchParams.get("isu_id") || undefined;
	const platform = searchParams.get("platform") || undefined;
	const take = Math.min(Number(searchParams.get("limit")) || 50, 200);

	const postingan = await prisma.postingan.findMany({
		where: { ...(isu_id && { isu_id }), ...(platform && { platform }) },
		orderBy: { tanggal_post: "desc" },
		take,
		include: { komentar: { include: { analisis: true, entitas: true } } },
	});

	return Response.json(postingan);
}

export async function POST(request: NextRequest) {
	try {
		const authErr = checkAuth(request);
		if (authErr) return authErr;

		const body = await request.json();
		const { isu_id, platform, judul, url, tanggal_post, komentar = [] } = body;

		if (!isu_id || !platform) {
			return Response.json({ error: "Missing required fields: isu_id, platform" }, { status: 400 });
		}

		const isu = await prisma.isu.findFirst({ where: { OR: [{ id: isu_id }, { slug: isu_id }] } });
		if (!isu) return Response.json({ error: "Isu not found" }, { status: 404 });

		const result = await prisma.$transaction(async (tx) => {
			const postingan = await tx.postingan.create({
				data: {
					isu_id: isu.id,
					platform,
					judul: judul ?? null,
					url: url ?? null,
					tanggal_post: tanggal_post ? new Date(tanggal_post) : null,
				},
			});

			await createKomentarBatch(tx, postingan.id, komentar);
			await recalculateOnPostinganChange(tx, postingan.id);
			return postingan;
		});

		return Response.json({ success: true, data: result }, { status: 201 });
	} catch (err: any) {
		return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
	}
}
