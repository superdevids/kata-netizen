import { NextRequest } from "next/server";
import { getIsuListPaginated } from "@/lib/query";
import { isAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const kategori = searchParams.get("kategori") || undefined;
	const search = searchParams.get("search") || undefined;
	const cursor = searchParams.get("cursor") || undefined;
	const limit = parseInt(searchParams.get("limit") || "10");
	const admin = isAdmin(request);
	
	const result = await getIsuListPaginated(kategori, search, limit, cursor, admin);
	
	return Response.json(result);
}
