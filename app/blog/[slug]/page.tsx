import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/medium/Navbar";
import { Footer } from "@/components/medium/Footer";
import { ArrowLeft, Clock } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";

const categoryColors: Record<string, string> = {
	Panduan: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
	Wawasan: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
	Metodologi: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
	Teknologi: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
};

export function generateStaticParams() {
	return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const post = blogPosts.find((p) => p.slug === slug);
	if (!post) return { title: "Artikel Tidak Ditemukan" };
	return {
		title: post.title,
		description: post.excerpt,
	};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const post = blogPosts.find((p) => p.slug === slug);

	if (!post) notFound();

	const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
	const related = blogPosts.filter((_, i) => i !== currentIndex).slice(0, 3);

	return (
		<div className="min-h-screen bg-white dark:bg-stone-900 flex flex-col">
			<Navbar />

			<main className="flex-1">
				<div className="max-w-6xl mx-auto px-6 pt-12 pb-20">
					{/* Back */}
					<Link
						href="/blog"
						className="inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors mb-8"
					>
						<ArrowLeft className="w-3.5 h-3.5" />
						Kembali ke Blog
					</Link>

					{/* Header */}
					<header className="mb-10">
						<div className="flex items-center gap-3 mb-4">
							<span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${categoryColors[post.category] ?? "bg-stone-100 text-stone-600"}`}>
								{post.category}
							</span>
							<span className="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1">
								<Clock className="w-3 h-3" />
								{post.readTime}
							</span>
						</div>
						<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 leading-tight mb-4">
							{post.title}
						</h1>
						<p className="text-stone-600 dark:text-stone-400 leading-loose text-lg">{post.excerpt}</p>
						<div className="flex items-center gap-3 mt-6 pt-5 border-t border-stone-100 dark:border-stone-800">
							<Image
								src="/logo.png"
								alt="Kata Netizen"
								width={32}
								height={32}
								className="w-8 h-8"
							/>
							<div>
								<p className="text-sm font-semibold text-stone-800 dark:text-stone-200">Kata Netizen</p>
								<p className="text-xs text-stone-400 dark:text-stone-500">{post.date}</p>
							</div>
						</div>
					</header>

					{/* Content */}
					<article className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-stone-900 dark:prose-headings:text-stone-100 prose-p:text-[1.05rem] prose-p:leading-[1.85] prose-p:text-stone-700 dark:prose-p:text-stone-300 prose-p:my-4 sm:prose-p:my-5 prose-a:text-blue-700 dark:prose-a:text-blue-400 prose-a:underline prose-a:decoration-blue-200 dark:prose-a:decoration-blue-800 hover:prose-a:decoration-blue-500 dark:hover:prose-a:decoration-blue-400 prose-strong:text-stone-900 dark:prose-strong:text-stone-100 prose-li:leading-loose">
						{post.content.map((paragraph, i) => (
							<p key={i}>{paragraph}</p>
						))}
					</article>

					{/* Related Posts */}
					<section className="mt-14">
						<h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-5">Artikel Lainnya</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{related.map((r) => (
								<Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
									<article className="flex gap-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
										<div className="flex-1 min-w-0">
											<span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium mb-2 ${categoryColors[r.category] ?? "bg-stone-100 text-stone-600"}`}>
												{r.category}
											</span>
											<h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
												{r.title}
											</h3>
											<p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">{r.excerpt}</p>
											<div className="flex items-center gap-3 text-[11px] text-stone-400 dark:text-stone-500 mt-2">
												<span>{r.date}</span>
												<span className="flex items-center gap-0.5">
													<Clock className="w-3 h-3" />
													{r.readTime}
												</span>
											</div>
										</div>
									</article>
								</Link>
							))}
						</div>
					</section>
				</div>
			</main>

			<Footer />
		</div>
	);
}
