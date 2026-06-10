import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/medium/Navbar";
import { Footer } from "@/components/medium/Footer";

export const metadata: Metadata = {
	title: "Kebijakan Privasi",
	description: "Kebijakan privasi Kata Netizen — bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="mb-10">
			<h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">{title}</h2>
			<div className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed space-y-3">{children}</div>
		</section>
	);
}

export default function PrivacyPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-stone-900 flex flex-col">
			<Navbar />

			<main className="flex-1">
				<div className="max-w-6xl mx-auto px-6 pt-16 pb-20">
					<p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Terakhir diperbarui: 10 Juni 2026</p>
					<h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">Kebijakan Privasi</h1>
					<p className="text-stone-600 dark:text-stone-400 leading-loose mb-10">
						Privasi Anda sangat penting bagi kami. Kebijakan ini menjelaskan secara transparan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan platform Kata Netizen.
					</p>

					<Section title="1. Informasi yang Kami Kumpulkan">
						<p>Kami mengumpulkan informasi dalam dua kategori:</p>
						<p><strong className="text-stone-800 dark:text-stone-200">Data yang dikumpulkan secara otomatis:</strong></p>
						<ul className="list-disc pl-5 space-y-1">
							<li>Alamat IP (dalam bentuk yang telah di-hash)</li>
							<li>Jenis browser dan sistem operasi</li>
							<li>Halaman yang dikunjungi dan durasi kunjungan</li>
							<li>Referrer (halaman sebelumnya yang Anda kunjungi)</li>
							<li>Waktu akses</li>
						</ul>
						<p><strong className="text-stone-800 dark:text-stone-200">Data yang Anda berikan secara sukarela:</strong></p>
						<ul className="list-disc pl-5 space-y-1">
							<li>Alamat email (jika Anda mendaftar newsletter)</li>
							<li>Pesan atau pertanyaan yang Anda kirim melalui formulir kontak</li>
						</ul>
					</Section>

					<Section title="2. Data Media Sosial">
						<p>
							Kami menganalisis komentar dari platform media sosial publik (seperti Instagram, Twitter/X, YouTube). Penting untuk dipahami:
						</p>
						<ul className="list-disc pl-5 space-y-1">
							<li>Kami <strong className="text-stone-800 dark:text-stone-200">tidak menyimpan</strong> identitas pengguna (nama, username, foto profil)</li>
							<li>Komentar dianalisis secara <strong className="text-stone-800 dark:text-stone-200">agregat dan anonim</strong></li>
							<li>Tidak ada komentar individual yang ditampilkan dalam bentuk yang dapat dilacak ke akun tertentu</li>
							<li>Kami hanya menampilkan pola, tren, dan ringkasan statistik dari keseluruhan data</li>
						</ul>
					</Section>

					<Section title="3. Bagaimana Kami Menggunakan Informasi">
						<p>Data yang kami kumpulkan digunakan untuk:</p>
						<ul className="list-disc pl-5 space-y-1">
							<li>Menyajikan analisis opini publik yang akurat dan relevan</li>
							<li>Meningkatkan kualitas dan performa platform</li>
							<li>Memahami bagaimana pengunjung menggunakan situs kami</li>
							<li>Mengirimkan newsletter (hanya dengan persetujuan Anda)</li>
							<li>Merespons pertanyaan atau permintaan dari Anda</li>
						</ul>
					</Section>

					<Section title="4. Cookies dan Teknologi Pelacakan">
						<p>
							Kami menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman Anda:
						</p>
						<ul className="list-disc pl-5 space-y-1">
							<li><strong className="text-stone-800 dark:text-stone-200">Cookies esensial:</strong> Diperlukan agar situs berfungsi dengan baik (misalnya, menyimpan preferensi)</li>
							<li><strong className="text-stone-800 dark:text-stone-200">Cookies analitik:</strong> Membantu kami memahami bagaimana pengunjung berinteraksi dengan situs</li>
						</ul>
						<p>
							Anda dapat mengelola preferensi cookies melalui pengaturan browser Anda. Namun, menonaktifkan beberapa cookies dapat memengaruhi fungsionalitas situs.
						</p>
					</Section>

					<Section title="5. Berbagi Data dengan Pihak Ketiga">
						<p>Kami <strong className="text-stone-800 dark:text-stone-200">tidak menjual</strong> data pribadi Anda kepada pihak ketiga. Kami dapat berbagi data dalam kondisi terbatas:</p>
						<ul className="list-disc pl-5 space-y-1">
							<li>Dengan penyedia layanan analitik (seperti Google Analytics) yang membantu kami memahami penggunaan situs</li>
							<li>Jika diwajibkan oleh hukum atau perintah pengadilan</li>
							<li>Dalam bentuk agregat dan anonim untuk keperluan riset atau publikasi</li>
						</ul>
					</Section>

					<Section title="6. Keamanan Data">
						<p>
							Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang wajar untuk melindungi informasi dari akses, penggunaan, atau pengungkapan yang tidak sah. Namun, tidak ada metode transmisi elektronik yang 100% aman, dan kami tidak dapat menjamin keamanan absolut.
						</p>
					</Section>

					<Section title="7. Hak Anda">
						<p>Sebagai pengguna, Anda memiliki hak:</p>
						<ul className="list-disc pl-5 space-y-1">
							<li><strong className="text-stone-800 dark:text-stone-200">Akses:</strong> Meminta salinan data pribadi yang kami simpan tentang Anda</li>
							<li><strong className="text-stone-800 dark:text-stone-200">Koreksi:</strong> Meminta perbaikan data yang tidak akurat</li>
							<li><strong className="text-stone-800 dark:text-stone-200">Penghapusan:</strong> Meminta penghapusan data pribadi Anda</li>
							<li><strong className="text-stone-800 dark:text-stone-200">Penarikan persetujuan:</strong> Berhenti berlangganan newsletter kapan saja</li>
						</ul>
						<p>
							Untuk menggunakan hak-hak ini, silakan hubungi kami di{" "}
							<a href="mailto:privacy@katanetizen.com" className="text-blue-700 dark:text-blue-400 underline decoration-blue-200 dark:decoration-blue-800 hover:decoration-blue-500 dark:hover:decoration-blue-400 transition-colors">
								privacy@katanetizen.com
							</a>.
						</p>
					</Section>

					<Section title="8. Retensi Data">
						<p>
							Kami menyimpan data analitik situs selama maksimal 26 bulan. Data email newsletter disimpan selama Anda tetap berlangganan. Jika Anda meminta penghapusan, kami akan memproses dalam waktu 30 hari.
						</p>
					</Section>

					<Section title="9. Perubahan Kebijakan">
						<p>
							Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Perubahan yang signifikan akan diumumkan melalui pemberitahuan di situs atau email. Tanggal &quot;Terakhir diperbarui&quot; di bagian atas menunjukkan revisi terbaru.
						</p>
					</Section>

					<Section title="10. Hubungi Kami">
						<p>
							Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau cara kami menangani data Anda, silakan hubungi kami:
						</p>
						<div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-1">
							<p><strong className="text-stone-800 dark:text-stone-200">Kata Netizen</strong></p>
							<p>Email: <a href="mailto:privacy@katanetizen.com" className="text-blue-700 dark:text-blue-400 underline decoration-blue-200 dark:decoration-blue-800 hover:decoration-blue-500 dark:hover:decoration-blue-400 transition-colors">privacy@katanetizen.com</a></p>
							<p>Website: <Link href="/" className="text-blue-700 dark:text-blue-400 underline decoration-blue-200 dark:decoration-blue-800 hover:decoration-blue-500 dark:hover:decoration-blue-400 transition-colors">katanetizen.com</Link></p>
						</div>
					</Section>
				</div>
			</main>

			<Footer />
		</div>
	);
}
