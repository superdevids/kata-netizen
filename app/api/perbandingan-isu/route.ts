import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const isu_id = searchParams.get("isu_id") || undefined;
	const take = Math.min(Number(searchParams.get("limit")) || 50, 200);

	const data = await prisma.perbandinganIsu.findMany({
		where: {
			...(isu_id && { OR: [{ isu_a_id: isu_id }, { isu_b_id: isu_id }] }),
		},
		orderBy: { tanggal: "desc" },
		take,
		include: {
			isu_a: { select: { id: true, slug: true, judul: true } },
			isu_b: { select: { id: true, slug: true, judul: true } },
		},
	});

	return Response.json(data);
}
