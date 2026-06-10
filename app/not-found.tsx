import Link from "next/link";
import { Navbar } from "@/components/medium/Navbar";
import { Footer } from "@/components/medium/Footer";
import { Home, Search, ArrowRight } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-white dark:bg-stone-900 flex flex-col">
			<Navbar />

			<main className="flex-1 flex items-center justify-center">
				<div className="max-w-xl mx-auto px-6 py-20 text-center">
					<p className="text-[8rem] sm:text-[10rem] font-black text-blue-100 dark:text-blue-950/50 leading-none select-none">404</p>
					<h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 -mt-16 sm:-mt-20 mb-4 relative">
						Halaman Tidak Ditemukan
					</h1>
					<p className="text-stone-600 dark:text-stone-400 leading-loose mb-8 max-w-sm mx-auto">
						Mohon maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. Silakan coba navigasi melalui halaman lain di bawah ini.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
						<Link
							href="/"
							className="inline-flex items-center gap-2 bg-blue-700 dark:bg-blue-600 text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
						>
							<Home className="w-4 h-4" />
							Kembali ke Beranda
						</Link>
						<Link
							href="/help"
							className="inline-flex items-center gap-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-sm px-6 py-3 rounded-full hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
						>
							<Search className="w-4 h-4" />
							Pusat Bantuan
						</Link>
					</div>

					<div className="border-t border-stone-100 dark:border-stone-800 pt-8">
						<p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">Halaman Populer</p>
						<div className="flex flex-col gap-2">
							{[
								{ label: "Analisis Terbaru", href: "/" },
								{ label: "Tentang Kami", href: "/about" },
								{ label: "Blog", href: "/blog" },
								{ label: "Kebijakan Privasi", href: "/privacy" },
							].map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="inline-flex items-center justify-center gap-1.5 text-sm text-stone-600 dark:text-stone-400 hover:text-blue-700 dark:hover:text-blue-400 py-1.5 transition-colors group"
								>
									{link.label}
									<ArrowRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
								</Link>
							))}
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
