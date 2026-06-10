import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/medium/Navbar";
import { Footer } from "@/components/medium/Footer";
import { NewsletterForm } from "@/components/medium/NewsletterForm";
import { Clock } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";

export const metadata: Metadata = {
	title: "Blog",
	description: "Artikel, panduan, dan insight seputar analisis sentimen, opini publik, dan tren percakapan digital Indonesia dari Kata Netizen.",
};

const posts = blogPosts;

const categoryColors: Record<string, string> = {
	Panduan: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
	Wawasan: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
	Metodologi: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
	Teknologi: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
};

export default function BlogPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-stone-900 flex flex-col">
			<Navbar />

			<main className="flex-1">
				{/* Hero */}
				<section className="max-w-6xl mx-auto px-6 pt-16 pb-10">
					<h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">Blog Kata Netizen</h1>
					<p className="text-lg text-stone-600 dark:text-stone-400 leading-loose">
						Panduan, wawasan, dan cerita di balik analisis opini publik. Kami menulis tentang cara kerja teknologi, metodologi, serta hal-hal menarik yang kami temukan dari percakapan digital Indonesia.
					</p>
				</section>

				{/* Featured Post */}
				<section className="max-w-6xl mx-auto px-6 pb-12">
					<Link href={`/blog/${posts[0].slug}`} className="group block">
						<div className="bg-gradient-to-br from-stone-50 to-blue-50/20 dark:from-stone-900 dark:to-blue-950/10 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all">
							<div className="flex items-center gap-2 mb-3">
								<span className={`px-2 py-0.5 rounded text-[11px] font-medium ${categoryColors[posts[0].category] ?? "bg-stone-100 text-stone-600"}`}>
									{posts[0].category}
								</span>
								<span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Unggulan</span>
							</div>
							<h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors mb-3 leading-snug">
								{posts[0].title}
							</h2>
							<p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">{posts[0].excerpt}</p>
							<div className="flex items-center gap-4 text-xs text-stone-400 dark:text-stone-500">
								<span>{posts[0].date}</span>
								<span className="flex items-center gap-1">
									<Clock className="w-3 h-3" />
									{posts[0].readTime}
								</span>
							</div>
						</div>
					</Link>
				</section>

				{/* Posts Grid */}
				<section className="max-w-6xl mx-auto px-6 pb-20">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">Semua Artikel</h2>
						<span className="text-xs text-stone-400 dark:text-stone-500">{posts.length} artikel</span>
					</div>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{posts.slice(1).map((post) => (
							<Link key={post.slug} href={`/blog/${post.slug}`} className="group">
								<article className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all h-full flex flex-col">
									<div className="flex items-center gap-2 mb-3">
										<span className={`px-2 py-0.5 rounded text-[11px] font-medium ${categoryColors[post.category] ?? "bg-stone-100 text-stone-600"}`}>
											{post.category}
										</span>
									</div>
									<h3 className="font-bold text-stone-900 dark:text-stone-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors mb-2 leading-snug line-clamp-2">
										{post.title}
									</h3>
									<p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3 mb-4 flex-1">
										{post.excerpt}
									</p>
									<div className="flex items-center justify-between text-xs text-stone-400 dark:text-stone-500 mt-auto pt-3 border-t border-stone-100 dark:border-stone-800">
										<span>{post.date}</span>
										<span className="flex items-center gap-1">
											<Clock className="w-3 h-3" />
											{post.readTime}
										</span>
									</div>
								</article>
							</Link>
						))}
					</div>
				</section>

				{/* Newsletter CTA */}
				<section className="max-w-6xl mx-auto px-6 pb-20">
					<div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-stone-900 rounded-2xl px-8 py-10 text-center">
						<h2 className="text-xl font-bold text-white mb-2">Jangan Lewatkan Insight Terbaru</h2>
						<p className="text-blue-200 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
							Dapatkan rangkuman analisis dan artikel terbaru langsung di inbox Anda. Tanpa spam, kami janji.
						</p>
						<NewsletterForm />
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
