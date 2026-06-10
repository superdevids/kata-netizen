import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/** Simple User-Agent parser — returns browser, os, device_type */
function parseUA(ua: string): { browser: string; os: string; device_type: string } {
	let browser = "unknown";
	let os = "unknown";
	let device_type = "desktop";

	// Browser
	if (/Edg\//i.test(ua)) browser = "Edge";
	else if (/OPR\/|Opera/i.test(ua)) browser = "Opera";
	else if (/Chrome\//i.test(ua)) browser = "Chrome";
	else if (/Firefox\//i.test(ua)) browser = "Firefox";
	else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";

	// OS
	if (/Windows/i.test(ua)) os = "Windows";
	else if (/Macintosh|Mac OS/i.test(ua)) os = "macOS";
	else if (/Android/i.test(ua)) os = "Android";
	else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
	else if (/Linux/i.test(ua)) os = "Linux";

	// Device type
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

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { visitor_id, session_id, page_url, referrer } = body;

		const ua = request.headers.get("user-agent") || "";
		const { browser, os, device_type } = parseUA(ua);
		const ip_address = getIP(request);

		await prisma.visitorLog.create({
			data: {
				visitor_id: visitor_id || null,
				session_id: session_id || null,
				page_url: page_url || request.headers.get("referer") || null,
				referrer: referrer || request.headers.get("referer") || null,
				device_type,
				browser,
				os,
				ip_address,
			},
		});

		return Response.json({ success: true }, { status: 201 });
	} catch (err: any) {
		return Response.json({ error: err.message || "Failed to log visit" }, { status: 500 });
	}
}
