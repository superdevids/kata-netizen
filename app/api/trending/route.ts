import { NextRequest } from "next/server";
import { getTrending } from "@/lib/query";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const limit = Number(searchParams.get("limit")) || 10;
	const data = await getTrending(limit);
	return Response.json({ data });
}
