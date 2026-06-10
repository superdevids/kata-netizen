import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/medium/Navbar";
import { Footer } from "@/components/medium/Footer";
import { BarChart3, Globe, Lightbulb, Shield, TrendingUp, Users } from "lucide-react";
import { aboutValues, aboutMilestones, aboutFeatures } from "@/data/about";
import { site } from "@/data/site";

export const metadata: Metadata = {
	title: "Tentang Kami",
	description: "Kenali lebih dekat misi, visi, dan cerita di balik Kata Netizen — platform analisis opini publik dan sentimen netizen Indonesia.",
};

const iconMap = {
	Globe, Shield, Lightbulb, Users, BarChart3, TrendingUp,
} as const;

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-stone-900 flex flex-col">
			<Navbar />

			<main className="flex-1">
				{/* Hero */}
				<section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
					<div className="flex justify-center mb-6">
						<Image
							src="/logo.png"
							alt="Kata Netizen"
							width={512}
							height={512}
							className="size-64"
						/>
					</div>
					<p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-4">Cerita Kami</p>
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 leading-tight mb-6">
						Mendengarkan Suara Publik,<br />Menyajikan Insight yang Bermakna
					</h1>
					<p className="text-lg text-stone-600 dark:text-stone-400 leading-loose max-w-3xl mx-auto">
						Kata Netizen lahir dari keyakinan bahwa setiap komentar, setiap opini, dan setiap percakapan di ruang digital menyimpan sinyal penting tentang apa yang benar-benar dirasakan oleh masyarakat Indonesia.
					</p>
				</section>

				{/* Author Identity */}
				<section className="max-w-6xl mx-auto px-6 pb-12">
					<div className="bg-gradient-to-br from-blue-900 via-blue-800 to-stone-900 rounded-2xl p-8 sm:p-10">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-bold">
								{site.author.identity.charAt(0)}
							</div>
							<div>
								<p className="text-sm font-semibold text-white">{site.author.identity}</p>
								<p className="text-xs text-blue-300">Penulis Kata Netizen</p>
							</div>
						</div>
						<p className="text-blue-100/80 leading-loose italic">
							&ldquo;{site.author.statement}&rdquo;
						</p>
					</div>
				</section>

				{/* Mission */}
				<section className="max-w-6xl mx-auto px-6 pb-16">
					<div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 sm:p-10">
						<h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">Misi Kami</h2>
						<p className="text-stone-600 dark:text-stone-400 leading-loose mb-6">
							Di tengah banjir informasi digital, tidak mudah untuk benar-benar memahami apa yang publik pikirkan. Media sosial sering kali hanya menampilkan suara yang paling keras — bukan gambaran yang utuh.
						</p>
						<p className="text-stone-600 dark:text-stone-400 leading-loose mb-6">
							Kata Netizen hadir untuk mengubah kebisingan itu menjadi kejelasan. Kami menggunakan <strong className="text-blue-700 dark:text-blue-400">teknologi analisis sentimen</strong>, <strong className="text-blue-700 dark:text-blue-400">pemrosesan bahasa alami</strong>, dan <strong className="text-blue-700 dark:text-blue-400">visualisasi data</strong> untuk membaca pola-pola opini publik dari ribuan komentar di berbagai platform media sosial.
						</p>
						<p className="text-stone-600 dark:text-stone-400 leading-loose">
							Hasilnya? Analisis yang tidak hanya menampilkan angka, tetapi juga <strong className="text-blue-700 dark:text-blue-400">menceritakan kisah di balik data</strong> — sehingga siapa pun bisa memahami, bukan hanya para ahli.
						</p>
					</div>
				</section>

				{/* What We Do */}
				<section className="max-w-6xl mx-auto px-6 pb-16">
					<h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3">Apa yang Kami Lakukan</h2>
					<p className="text-stone-600 dark:text-stone-400 leading-loose mb-8">
						Setiap artikel di Kata Netizen merupakan hasil analisis mendalam terhadap percakapan publik di media sosial. Kami menggabungkan beberapa pendekatan berikut:
					</p>
					<div className="grid sm:grid-cols-2 gap-4">
						{aboutFeatures.map((item) => {
							const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Globe;
							return (
								<div key={item.title} className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
									<div className="flex items-center gap-3 mb-3">
										<div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0">
											<Icon className="w-4 h-4 text-white" />
										</div>
										<h3 className="font-semibold text-stone-900 dark:text-stone-100">{item.title}</h3>
									</div>
									<p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{item.desc}</p>
								</div>
							);
						})}
					</div>
				</section>

				{/* Values */}
				<section className="max-w-6xl mx-auto px-6 pb-16">
					<h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3">Nilai yang Kami Pegang</h2>
					<p className="text-stone-600 dark:text-stone-400 leading-loose mb-8">
						Prinsip-prinsip ini menjadi fondasi dari setiap keputusan yang kami ambil dan setiap fitur yang kami bangun.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{aboutValues.map((v) => {
							const Icon = iconMap[v.icon as keyof typeof iconMap] ?? Globe;
							return (
								<div key={v.title} className="flex gap-4 p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
									<div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center shrink-0">
										<Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
									</div>
									<div>
										<h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">{v.title}</h3>
										<p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{v.description}</p>
									</div>
								</div>
							);
						})}
					</div>
				</section>

				{/* Timeline */}
				<section className="max-w-6xl mx-auto px-6 pb-16">
					<h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-8">Perjalanan Kami</h2>
					<div className="space-y-0">
						{aboutMilestones.map((m, i) => (
							<div key={`${m.year}-${i}`} className="flex gap-5">
								<div className="flex flex-col items-center">
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
										{m.year}
									</div>
									{i < aboutMilestones.length - 1 && <div className="w-px h-full bg-blue-200 dark:bg-blue-800/50 my-1" />}
								</div>
								<div className="pb-8">
									<h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">{m.title}</h3>
									<p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{m.description}</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* CTA */}
				<section className="max-w-6xl mx-auto px-6 pb-20 text-center">
					<div className="bg-gradient-to-br from-blue-900 via-blue-800 to-stone-900 rounded-2xl px-8 py-12">
						<h2 className="text-2xl font-bold text-white mb-3">Tertarik dengan Analisis Kami?</h2>
						<p className="text-blue-200 mb-6 max-w-md mx-auto leading-relaxed">
							Jelajahi berbagai isu yang sedang kami pantau dan dapatkan insight dari percakapan publik Indonesia.
						</p>
						<Link
							href="/"
							className="inline-flex items-center gap-2 bg-white text-blue-800 font-semibold text-sm px-6 py-3 rounded-full hover:bg-blue-50 transition-colors"
						>
							Mulai Jelajahi
						</Link>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
