import { NextRequest } from "next/server";
import { readAll, append, updateMany } from "@/lib/json-db";

interface Subscriber {
	email: string;
	is_active: boolean;
	subscribed_at: string;
	unsubscribed_at: string | null;
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email } = body;

		if (!email || typeof email !== "string") {
			return Response.json({ error: "Email is required" }, { status: 400 });
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return Response.json({ error: "Format email tidak valid" }, { status: 400 });
		}

		const existing = readAll<Subscriber>("newsletter").find((s) => s.email === email);

		if (existing) {
			if (existing.is_active) {
				return Response.json({ message: "Email ini sudah terdaftar sebagai subscriber." }, { status: 200 });
			}
			// Re-activate
			updateMany<Subscriber>(
				"newsletter",
				(s) => s.email === email,
				(s) => ({ ...s, is_active: true, unsubscribed_at: null }),
			);
			return Response.json({ success: true, message: "Selamat datang kembali! Anda telah berlangganan kembali." }, { status: 200 });
		}

		append<Subscriber>("newsletter", {
			email,
			is_active: true,
			subscribed_at: new Date().toISOString(),
			unsubscribed_at: null,
		});

		return Response.json({ success: true, message: "Berhasil berlangganan! Anda akan menerima notifikasi artikel terbaru." }, { status: 201 });
	} catch (err: any) {
		return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const email = searchParams.get("email");
		const action = searchParams.get("action") || "unsubscribe";

		if (!email) {
			return Response.json({ error: "Email is required" }, { status: 400 });
		}

		if (action === "unsubscribe") {
			const count = updateMany<Subscriber>(
				"newsletter",
				(s) => s.email === email && s.is_active,
				(s) => ({ ...s, is_active: false, unsubscribed_at: new Date().toISOString() }),
			);
			if (count === 0) {
				return Response.json({ message: "Email tidak ditemukan atau sudah tidak aktif." });
			}
			return Response.json({ success: true, message: "Anda telah berhenti berlangganan." });
		}

		return Response.json({ error: "Invalid action" }, { status: 400 });
	} catch (err: any) {
		return Response.json({ error: err.message || "Internal server error" }, { status: 500 });
	}
}
