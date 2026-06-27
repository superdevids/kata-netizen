import { NextRequest } from "next/server";
import { getMdArticleListPaginated } from "@/lib/md-loader";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const kategori = searchParams.get("kategori") || undefined;
	const search = searchParams.get("search") || undefined;
	const offset = parseInt(searchParams.get("cursor") || "0");
	const limit = parseInt(searchParams.get("limit") || "10");

	const result = getMdArticleListPaginated(kategori, search, limit, offset);

	return Response.json({
		data: result.data,
		nextCursor: result.nextOffset !== null ? String(result.nextOffset) : null,
	});
}
