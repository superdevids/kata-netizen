import { NextRequest } from "next/server";
import { appendWithLimit } from "@/lib/json-db";

function parseUA(ua: string): { browser: string; os: string; device_type: string } {
	let browser = "unknown";
	let os = "unknown";
	let device_type = "desktop";

	if (/Edg\//i.test(ua)) browser = "Edge";
	else if (/OPR\/|Opera/i.test(ua)) browser = "Opera";
	else if (/Chrome\//i.test(ua)) browser = "Chrome";
	else if (/Firefox\//i.test(ua)) browser = "Firefox";
	else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";

	if (/Windows/i.test(ua)) os = "Windows";
	else if (/Macintosh|Mac OS/i.test(ua)) os = "macOS";
	else if (/Android/i.test(ua)) os = "Android";
	else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
	else if (/Linux/i.test(ua)) os = "Linux";

	if (/Mobile|Android.*Mobile|iPhone|iPod/i.test(ua)) device_type = "mobile";
	else if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) device_type = "tablet";

	return { browser, os, device_type };
}

function getIP(request: NextRequest): string {
	return (
		request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
		request.headers.get("x-real-ip") ||
		"unknown"
	);
}

/** Get today's date as YYYY-MM-DD */
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { visitor_id, session_id, page_url, referrer } = body;
		const ua = request.headers.get("user-agent") || "";
		const { browser, os, device_type } = parseUA(ua);
		const ip_address = getIP(request);

		// 1 file per hari: data/visitor-log/2026-06-27.json
		// Max 50.000 entries per hari (anti overload)
		appendWithLimit(`visitor-log/${today()}`, {
			visitor_id: visitor_id || null,
			session_id: session_id || null,
			page_url: page_url || request.headers.get("referer") || null,
			referrer: referrer || request.headers.get("referer") || null,
			device_type,
			browser,
			os,
			ip_address,
			visited_at: new Date().toISOString(),
		}, 50_000);

		return Response.json({ success: true }, { status: 201 });
	} catch (err: any) {
		return Response.json({ error: err.message || "Failed to log visit" }, { status: 500 });
	}
}
