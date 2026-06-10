import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createKomentarBatch } from "@/lib/api-helpers";
import { recalculateOnPostinganChange, recalculateIsuById } from "@/lib/recalculate";
import { checkAuth } from "@/lib/auth";

export async function GET(
	_req: NextRequest,
	ctx: RouteContext<"/api/postingan/[id]">
) {
	const { id } = await ctx.params;
	const postingan = await prisma.postingan.findUnique({
		where: { id },
		include: { komentar: { include: { analisis: true, entitas: true } } },
	});
	if (!postingan) return Response.json({ error: "Not found" }, { status: 404 });
	return Response.json(postingan);
}

export async function PUT(
	request: NextRequest,
	ctx: RouteContext<"/api/postingan/[id]">
) {
	try {
		const authErr = checkAuth(request);
		if (authErr) return authErr;

		const { id } = await ctx.params;
		const body = await request.json();

		const existing = await prisma.postingan.findUnique({ where: { id } });
		if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

		const result = await prisma.$transaction(async (tx) => {
			const postingan = await tx.postingan.update({
				where: { id },
				data: {
					...(body.isu_id !== undefined && { isu_id: body.isu_id }),
					...(body.platform !== undefined && { platform: body.platform }),
					...(body.judul !== undefined && { judul: body.judul }),
					...(body.url !== undefined && { url: body.url }),
					...(body.tanggal_post !== undefined && { tanggal_post: body.tanggal_post ? new Date(body.tanggal_post) : null }),
				},
			});

			if (body.komentar !== undefined) {
				await tx.komentar.deleteMany({ where: { postingan_id: id } });
				await createKomentarBatch(tx, id, body.komentar);
			}

			await recalculateOnPostinganChange(tx, id);
			return postingan;
		});

		return Response.json({ success: true, data: result });
	} catch (err: any) {
		return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(
	request: NextRequest,
	ctx: RouteContext<"/api/postingan/[id]">
) {
	try {
		const authErr = checkAuth(request);
		if (authErr) return authErr;

		const { id } = await ctx.params;
		const existing = await prisma.postingan.findUnique({ where: { id } });
		if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

		await prisma.$transaction(async (tx) => {
			await tx.postingan.delete({ where: { id } });
			await recalculateIsuById(tx, existing.isu_id);
		});

		return Response.json({ success: true, message: "Deleted successfully" });
	} catch (err: any) {
		return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
	}
}
