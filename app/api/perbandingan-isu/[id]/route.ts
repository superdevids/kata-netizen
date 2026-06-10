import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
	_req: NextRequest,
	ctx: RouteContext<"/api/perbandingan-isu/[id]">
) {
	const { id } = await ctx.params;

	const data = await prisma.perbandinganIsu.findUnique({
		where: { id },
		include: {
			isu_a: { select: { id: true, slug: true, judul: true } },
			isu_b: { select: { id: true, slug: true, judul: true } },
		},
	});

	if (!data) {
		return Response.json({ error: "Not found" }, { status: 404 });
	}

	return Response.json(data);
}
