import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/newsletter — subscribe to newsletter
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email } = body;

		if (!email || typeof email !== "string") {
			return Response.json({ error: "Email is required" }, { status: 400 });
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return Response.json({ error: "Format email tidak valid" }, { status: 400 });
		}

		// Check if already subscribed
		const existing = await prisma.subscriber.findUnique({ where: { email } });
		if (existing) {
			if (existing.is_active) {
				return Response.json({ message: "Email ini sudah terdaftar sebagai subscriber." }, { status: 200 });
			}
			// Re-activate if previously unsubscribed
			await prisma.subscriber.update({
				where: { email },
				data: { is_active: true, unsubscribed_at: null },
			});
			return Response.json({ success: true, message: "Selamat datang kembali! Anda telah berlangganan kembali." }, { status: 200 });
		}

		await prisma.subscriber.create({ data: { email } });
		return Response.json({ success: true, message: "Berhasil berlangganan! Anda akan menerima notifikasi artikel terbaru." }, { status: 201 });
	} catch (err: any) {
		return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
	}
}

// GET /api/newsletter?email=...&action=unsubscribe — unsubscribe from newsletter
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const email = searchParams.get("email");
		const action = searchParams.get("action") || "unsubscribe";

		if (!email) {
			return Response.json({ error: "Email is required" }, { status: 400 });
		}

		if (action === "unsubscribe") {
			await prisma.subscriber.updateMany({
				where: { email, is_active: true },
				data: { is_active: false, unsubscribed_at: new Date() },
			});
			return Response.json({ success: true, message: "Anda telah berhenti berlangganan." });
		}

		return Response.json({ error: "Invalid action" }, { status: 400 });
	} catch (err: any) {
		return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
	}
}
