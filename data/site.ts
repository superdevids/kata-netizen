/**
 * Site-wide identity, branding, and author information.
 * All identity-related data for Kata Netizen lives here.
 */

export const site = {
	name: "Kata Netizen",
	url: "https://katanetizen.com",
	email: "hello@katanetizen.com",
	privacyEmail: "privacy@katanetizen.com",
	legalEmail: "legal@katanetizen.com",
	description: "Platform analisis opini publik dan sentimen netizen Indonesia. Kami membaca percakapan digital, lalu mengubahnya menjadi insight yang bermakna untuk semua kalangan.",
	author: {
		identity: "Anonymous",
		statement: "Penulis di balik Kata Netizen adalah bagian dari masyarakat — anonim, namun merasa bertanggung jawab dan kompeten untuk membantu publik menganalisis sentimen dan opini yang beredar di ruang digital Indonesia. Kami tidak mewakili kelompok mana pun; kami hadir karena percaya bahwa setiap warga berhak memahami apa yang sebenarnya dirasakan masyarakat, bukan hanya apa yang paling keras disuarakan.",
	},
};

export const navLinks = [
	{ title: "Tentang", href: "/about" },
	{ title: "Blog", href: "/blog" },
	{ title: "Bantuan", href: "/help" },
	{ title: "Dukungan", href: "/support" },
];

export const footerLinks = {
	platform: [
		{ label: "Beranda", href: "/" },
		{ label: "Tentang Kami", href: "/about" },
		{ label: "Blog", href: "/blog" },
		{ label: "Dukung Kami", href: "/support" },
	],
	bantuan: [
		{ label: "Pusat Bantuan", href: "/help" },
		{ label: "Kebijakan Privasi", href: "/privacy" },
		{ label: "Syarat & Ketentuan", href: "/terms" },
	],
};