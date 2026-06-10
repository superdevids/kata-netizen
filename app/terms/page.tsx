import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/medium/Navbar";
import { Footer } from "@/components/medium/Footer";

export const metadata: Metadata = {
	title: "Syarat & Ketentuan",
	description: "Syarat dan ketentuan penggunaan platform Kata Netizen. Harap dibaca dengan seksama sebelum menggunakan layanan kami.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="mb-10">
			<h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">{title}</h2>
			<div className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">{children}</div>
		</section>
	);
}

export default function TermsPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-stone-900 flex flex-col">
			<Navbar />

			<main className="flex-1">
				<div className="max-w-6xl mx-auto px-6 pt-16 pb-20">
					<p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Terakhir diperbarui: 10 Juni 2026</p>
					<h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">Syarat & Ketentuan</h1>
					<p className="text-stone-600 dark:text-stone-400 leading-loose mb-10">
						Dengan mengakses atau menggunakan platform Kata Netizen, Anda menyetujui syarat dan ketentuan berikut. Kami sarankan Anda membaca dengan saksama sebelum menggunakan layanan kami.
					</p>

					<Section title="1. Penerimaan Syarat">
						<p>
							Dengan menggunakan situs web katanetizen.com (&quot;Platform&quot;), Anda mengakui bahwa Anda telah membaca, memahami, dan menyetujui terikat oleh Syarat & Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun, silakan tidak menggunakan Platform kami.
						</p>
					</Section>

					<Section title="2. Deskripsi Layanan">
						<p>Kata Netizen menyediakan:</p>
						<ul className="list-disc pl-5 space-y-1">
							<li>Analisis opini publik berdasarkan komentar dari platform media sosial</li>
							<li>Visualisasi data sentimen, tren, dan narasi publik</li>
							<li>Artikel analisis isu-isu terkini di Indonesia</li>
							<li>Konten edukatif seputar analisis sentimen dan literasi data</li>
						</ul>
						<p>
							Layanan ini disediakan &quot;sebagaimana adanya&quot; dan kami berusaha untuk selalu menjaga akurasi dan ketersediaan platform.
						</p>
					</Section>

					<Section title="3. Penggunaan yang Diizinkan">
						<p>Anda diperbolehkan untuk:</p>
						<ul className="list-disc pl-5 space-y-1">
							<li>Mengakses dan membaca konten di Platform untuk keperluan pribadi dan non-komersial</li>
							<li>Berbagi tautan ke artikel Kata Netizen di media sosial atau platform lain</li>
							<li>Mengutip data atau insight dari Platform dengan menyebutkan sumber secara jelas</li>
						</ul>
					</Section>

					<Section title="4. Penggunaan yang Dilarang">
						<p>Anda <strong className="text-stone-800 dark:text-stone-200">tidak diperbolehkan</strong> untuk:</p>
						<ul className="list-disc pl-5 space-y-1">
							<li>Menyalin, mereproduksi, atau mendistribusikan konten Platform secara massal tanpa izin tertulis</li>
							<li>Menggunakan scraper, bot, atau alat otomatis untuk mengakses konten secara berlebihan</li>
							<li>Memanipulasi atau menyajikan ulang data kami dengan cara yang menyesatkan</li>
							<li>Mencoba mengakses sistem, server, atau jaringan yang terhubung dengan Platform secara tidak sah</li>
							<li>Menggunakan Platform untuk tujuan yang melanggar hukum atau merugikan pihak lain</li>
						</ul>
					</Section>

					<Section title="5. Hak Kekayaan Intelektual">
						<p>
							Seluruh konten di Platform — termasuk tetapi tidak terbatas pada teks, grafik, logo, visualisasi data, ilustrasi, dan kode sumber — merupakan milik Kata Netizen atau pihak yang memberikan lisensi kepada kami, dan dilindungi oleh undang-undang hak cipta Indonesia dan internasional.
						</p>
						<p>
							Penggunaan konten untuk keperluan akademik atau jurnalistik diperbolehkan selama menyebutkan <strong className="text-stone-800 dark:text-stone-200">&quot;Kata Netizen (katanetizen.com)&quot;</strong> sebagai sumber.
						</p>
					</Section>

					<Section title="6. Akurasi Data dan Disclaimer">
						<p>
							Kami berusaha menyajikan analisis yang akurat dan dapat dipertanggungjawabkan. Namun:
						</p>
						<ul className="list-disc pl-5 space-y-1">
							<li>Analisis sentimen dihasilkan oleh sistem otomatis dan mungkin memiliki tingkat kesalahan tertentu</li>
							<li>Data yang ditampilkan merupakan representasi statistik, bukan fakta absolut tentang opini seluruh masyarakat</li>
							<li>Kami tidak bertanggung jawab atas keputusan yang diambil berdasarkan data di Platform</li>
							<li>Konten analisis tidak dimaksudkan sebagai nasihat profesional (hukum, keuangan, politik, dll.)</li>
						</ul>
					</Section>

					<Section title="7. Tautan ke Situs Pihak Ketiga">
						<p>
							Platform mungkin mengandung tautan ke situs web pihak ketiga. Tautan tersebut disediakan untuk kenyamanan Anda dan tidak berarti kami mendukung atau bertanggung jawab atas konten di situs tersebut. Kami tidak memiliki kendali atas situs web pihak ketiga.
						</p>
					</Section>

					<Section title="8. Batasan Tanggung Jawab">
						<p>
							Sejauh diizinkan oleh hukum yang berlaku, Kata Netizen beserta tim, direktur, dan mitranya tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan Platform.
						</p>
					</Section>

					<Section title="9. Ketersediaan Layanan">
						<p>
							Kami berusaha menjaga Platform agar selalu tersedia. Namun, kami tidak menjamin bahwa layanan akan selalu berjalan tanpa gangguan. Pemeliharaan sistem, pembaruan, atau kondisi di luar kendali kami dapat menyebabkan downtime sementara.
						</p>
					</Section>

					<Section title="10. Perubahan Syarat">
						<p>
							Kami berhak memperbarui Syarat & Ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini. Penggunaan Platform secara berkelanjutan setelah perubahan dianggap sebagai penerimaan terhadap syarat yang diperbarui.
						</p>
					</Section>

					<Section title="11. Hukum yang Berlaku">
						<p>
							Syarat & Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan secara musyawarah, dan jika tidak tercapai kesepakatan, akan diajukan ke pengadilan yang berwenang di Indonesia.
						</p>
					</Section>

					<Section title="12. Hubungi Kami">
						<p>
							Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami:
						</p>
						<div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-1">
							<p><strong className="text-stone-800 dark:text-stone-200">Kata Netizen</strong></p>
							<p>Email: <a href="mailto:legal@katanetizen.com" className="text-blue-700 dark:text-blue-400 underline decoration-blue-200 dark:decoration-blue-800 hover:decoration-blue-500 dark:hover:decoration-blue-400 transition-colors">legal@katanetizen.com</a></p>
							<p>Website: <Link href="/" className="text-blue-700 dark:text-blue-400 underline decoration-blue-200 dark:decoration-blue-800 hover:decoration-blue-500 dark:hover:decoration-blue-400 transition-colors">katanetizen.com</Link></p>
						</div>
					</Section>
				</div>
			</main>

			<Footer />
		</div>
	);
}
