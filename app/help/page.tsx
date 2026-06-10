"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/medium/Navbar";
import { Footer } from "@/components/medium/Footer";
import { ChevronDown, Mail, MessageCircle, Search, BookOpen, BarChart3, Shield, Lightbulb } from "lucide-react";
import { faqCategories } from "@/data/faq";
import { site } from "@/data/site";

const iconMap = {
	BookOpen,
	BarChart3,
	Shield,
	Lightbulb,
} as const;

function FaqItem({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="border-b border-stone-100 dark:border-stone-800 last:border-0">
			<button
				onClick={() => setOpen(!open)}
				className="w-full flex items-start justify-between gap-4 py-4 text-left cursor-pointer group"
			>
				<span className="text-sm font-medium text-stone-800 dark:text-stone-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{q}</span>
				<ChevronDown className={`w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
			</button>
			{open && (
				<div className="pb-4 pr-8">
					<p className="text-sm text-stone-600 dark:text-stone-400 leading-loose">{a}</p>
				</div>
			)}
		</div>
	);
}

export default function HelpPage() {
	const [search, setSearch] = useState("");

	const allItems = faqCategories.flatMap((c) => c.items);
	const filtered = search.trim()
		? allItems.filter((item) => item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase()))
		: [];

	return (
		<div className="min-h-screen bg-white dark:bg-stone-900 flex flex-col">
			<Navbar />

			<main className="flex-1">
				{/* Hero */}
				<section className="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
					<h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">Pusat Bantuan</h1>
					<p className="text-lg text-stone-600 dark:text-stone-400 mb-8 leading-loose">
						Temukan jawaban atas pertanyaan Anda tentang Kata Netizen. Kami telah menyusun daftar pertanyaan yang paling sering ditanyakan oleh pengguna.
					</p>
					<div className="relative max-w-md mx-auto">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Ketik pertanyaan Anda di sini..."
							className="w-full pl-11 pr-4 py-3 text-sm border border-stone-200 dark:border-stone-700 rounded-full bg-stone-50 dark:bg-stone-900 dark:text-stone-100 focus:bg-white dark:focus:bg-stone-800 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 focus:outline-none transition-all"
						/>
					</div>
				</section>

				{/* Search Results */}
				{search.trim() && (
					<section className="max-w-6xl mx-auto px-6 pb-10">
						{filtered.length > 0 ? (
							<div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5">
								<p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
									{filtered.length} hasil ditemukan
								</p>
								{filtered.map((item, i) => (
									<FaqItem key={i} q={item.q} a={item.a} />
								))}
							</div>
						) : (
							<p className="text-sm text-stone-500 dark:text-stone-400 text-center py-6">
								Tidak ada hasil untuk &quot;{search}&quot;. Coba kata kunci lain atau hubungi kami langsung.
							</p>
						)}
					</section>
				)}

				{/* FAQ Categories */}
				{!search.trim() && (
					<section className="max-w-6xl mx-auto px-6 pb-16">
						<div className="space-y-8">
							{faqCategories.map((cat) => {
								const CatIcon = iconMap[cat.icon] ?? BookOpen;
								return (
									<div key={cat.title}>
										<div className="flex items-center gap-3 mb-4">
											<div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
												<CatIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
											</div>
											<h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">{cat.title}</h2>
										</div>
										<div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-5">
											{cat.items.map((item) => (
												<FaqItem key={item.q} q={item.q} a={item.a} />
											))}
										</div>
									</div>
								);
							})}
						</div>
					</section>
				)}

				{/* Contact */}
				<section className="max-w-6xl mx-auto px-6 pb-20">
					<div className="bg-gradient-to-br from-stone-50 to-blue-50/30 dark:from-stone-900 dark:to-blue-950/20 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 text-center">
						<h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">Masih Ada Pertanyaan?</h2>
						<p className="text-sm text-stone-600 dark:text-stone-400 mb-6 max-w-sm mx-auto leading-loose">
							Tidak menemukan jawaban yang Anda cari? Jangan ragu untuk menghubungi kami — tim kami akan dengan senang hati membantu Anda.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
							<a
								href={`mailto:${site.email}`}
								className="inline-flex items-center gap-2 bg-blue-700 dark:bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
							>
								<Mail className="w-4 h-4" />
								{site.email}
							</a>
							<Link
								href="/about"
								className="inline-flex items-center gap-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-sm font-semibold px-6 py-3 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
							>
								<MessageCircle className="w-4 h-4" />
								Tentang Kami
							</Link>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
