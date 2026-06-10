import { NextRequest } from "next/server";
import { getIsuDetail } from "@/lib/query";
import { prisma } from "@/lib/prisma";
import { replaceIsuChildren, ISU_CHILD_TABLES } from "@/lib/api-helpers";
import { checkAuth, isAdmin } from "@/lib/auth";
import { notifySubscribers } from "@/lib/email";

export async function GET(
	request: NextRequest,
	ctx: RouteContext<"/api/isu/[slug]">
) {
	const { slug } = await ctx.params;
	const admin = isAdmin(request);
	const detail = await getIsuDetail(slug, admin);
	if (!detail) return Response.json({ error: "Not found" }, { status: 404 });
	return Response.json(detail);
}

export async function PUT(
	request: NextRequest,
	ctx: RouteContext<"/api/isu/[slug]">
) {
	try {
		const authErr = checkAuth(request);
		if (authErr) return authErr;

		const { slug } = await ctx.params;
		const body = await request.json();

		const existing = await prisma.isu.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
		if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

		// Detect publish transition: was draft, now being published
		const wasDraft = existing.is_draft;

		const result = await prisma.$transaction(async (tx) => {
			const isu = await tx.isu.update({
				where: { id: existing.id },
				data: {
					...(body.slug !== undefined && { slug: body.slug || null }),
					...(body.judul !== undefined && { judul: body.judul }),
					...(body.deskripsi !== undefined && { deskripsi: body.deskripsi }),
					...(body.konten !== undefined && { konten: body.konten }),
					...(body.thumbnail !== undefined && { thumbnail: body.thumbnail }),
					...(body.kategori !== undefined && { kategori: body.kategori }),
					...(body.kata_kunci !== undefined && { kata_kunci: body.kata_kunci }),
					...(body.aktif !== undefined && { aktif: body.aktif }),
					...(body.is_draft !== undefined && { is_draft: body.is_draft }),
				},
			});

			for (const { key, model, defs } of ISU_CHILD_TABLES) {
				if (body[key] !== undefined) {
					await replaceIsuChildren(tx, model, existing.id, body[key], defs);
				}
			}

			return isu;
		});

		// Notify subscribers when publishing (draft → published)
		if (wasDraft && !result.is_draft) {
			notifySubscribers(result).catch(() => {
				// Silently handle newsletter notification errors
			});
		}

		return Response.json({ success: true, data: result });
	} catch (err: any) {
		if (err.code === "P2002") return Response.json({ error: "Slug already exists" }, { status: 409 });
		return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(
	request: NextRequest,
	ctx: RouteContext<"/api/isu/[slug]">
) {
	try {
		const authErr = checkAuth(request);
		if (authErr) return authErr;

		const { slug } = await ctx.params;
		const existing = await prisma.isu.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
		if (!existing) return Response.json({ error: "Not found" }, { status: 404 });
		await prisma.isu.delete({ where: { id: existing.id } });
		return Response.json({ success: true, message: "Deleted successfully" });
	} catch (err: any) {
		return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
	}
}
