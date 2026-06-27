import { Resend } from "resend";
import { readAll } from "./json-db";

interface Subscriber {
	email: string;
	is_active: boolean;
	subscribed_at: string;
	unsubscribed_at: string | null;
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function notifySubscribers(isu: { judul: string; slug?: string | null; deskripsi: string; kategori: string }) {
	const subscribers = readAll<Subscriber>("newsletter")
		.filter((s) => s.is_active)
		.slice(0, 100);

	if (subscribers.length === 0) return;

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://katanetizen.com";
	const articleUrl = `${baseUrl}/${isu.slug || ""}`;

	const html = `
		<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="text-align: center; margin-bottom: 24px;">
				<h1 style="color: #2563eb; font-size: 20px; margin: 0;">Kata Netizen</h1>
				<p style="color: #78716c; font-size: 13px; margin-top: 4px;">Analisis Opini Publik Indonesia</p>
			</div>
			<div style="background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px; padding: 24px;">
				<p style="color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Artikel Baru — ${isu.kategori}</p>
				<h2 style="color: #1c1917; font-size: 22px; margin: 0 0 12px 0; line-height: 1.3;">${isu.judul}</h2>
				<p style="color: #57534e; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">${isu.deskripsi.slice(0, 200)}${isu.deskripsi.length > 200 ? "..." : ""}</p>
				<a href="${articleUrl}" style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 10px 24px; border-radius: 24px; font-size: 14px; font-weight: 600;">Baca Analisis Lengkap</a>
			</div>
			<p style="color: #a8a29e; font-size: 11px; text-align: center; margin-top: 24px;">
				Anda menerima email ini karena berlangganan newsletter Kata Netizen.<br/>
				<a href="${baseUrl}/api/newsletter?email={{EMAIL}}&action=unsubscribe" style="color: #a8a29e;">Berhenti berlangganan</a>
			</p>
		</div>
	`;

	if (!resend) return;

	const fromEmail = process.env.RESEND_FROM_EMAIL || "Kata Netizen <onboarding@resend.dev>";

	for (const sub of subscribers) {
		try {
			const personalizedHtml = html.replace("{{EMAIL}}", encodeURIComponent(sub.email));
			await resend.emails.send({
				from: fromEmail,
				to: sub.email,
				subject: `Artikel Baru: ${isu.judul}`,
				html: personalizedHtml,
			});
		} catch {
			// Silently handle send errors
		}
	}
}
