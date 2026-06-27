import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/medium/Navbar";
import { ArticleProgress } from "@/components/medium/ArticleProgress";
import { ArticleBody } from "@/components/medium/ArticleBody";
import { RelatedArticles } from "@/components/medium/RelatedArticles";
import { TableOfContents } from "@/components/medium/TableOfContents";
import { ShareButtons } from "@/components/medium/ShareButtons";
import { BackToTop } from "@/components/medium/BackToTop";
import { Footer } from "@/components/medium/Footer";
import { MobileSidebar } from "@/components/medium/MobileSidebar";
import { BookOpen, ChevronRight } from "lucide-react";
import { getAllSlugs, getMdArticle, getAllArticles } from "@/lib/md-loader";

// ═══ Static Generation ═══════════════════════════════════════════════════════

export function generateStaticParams() {
	return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const detail = getMdArticle(slug);
	if (!detail) return { title: "Artikel Tidak Ditemukan" };
	return {
		title: detail.title,
		description: detail.description,
	};
}

// ═══ Page ════════════════════════════════════════════════════════════════════

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const detail = getMdArticle(slug);
	const allArticles = getAllArticles();
	const recommended = allArticles.filter((a) => a.slug !== slug).slice(0, 5);
	const trending = allArticles.slice(0, 10);

	if (!detail) notFound();

	return (
		<div className="min-h-screen bg-white dark:bg-stone-900">
			<ArticleProgress />
			<Navbar />

			<main className="max-w-334 mx-auto px-6 pt-6 pb-32 lg:pb-16">
				{/* Breadcrumb */}
				<nav className="flex items-center gap-1.5 text-xs text-text-faint mb-6" aria-label="Breadcrumb">
					<Link href="/" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Beranda</Link>
					<ChevronRight className="h-3 w-3 shrink-0" />
					{detail.kategori && (
						<>
							<Link href={`/?kategori=${detail.kategori}`} className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">{detail.kategori}</Link>
							<ChevronRight className="h-3 w-3 shrink-0" />
						</>
					)}
					<span className="text-stone-500 dark:text-text-muted truncate max-w-[200px]">{detail.title}</span>
				</nav>

				<div className="flex gap-6">
					{/* Main Article Column */}
					<div className="flex-1 min-w-0">
						{/* Category */}
						<div className="flex items-center gap-3 mb-5">
							{detail.kategori && (
								<Badge variant="secondary" className="rounded-full bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700 text-xs font-medium px-3 h-6 cursor-pointer transition-colors">
									{detail.kategori}
								</Badge>
							)}
						</div>

						{/* Title */}
						<h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight text-stone-900 dark:text-text-heading mb-4 tracking-tight">{detail.title}</h1>

						{/* Description */}
						<p className="text-lg sm:text-xl text-stone-500 dark:text-text-muted leading-relaxed mb-8">{detail.description}</p>

						{/* Author + Date + Share */}
						<div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-stone-100 dark:border-border-subtle">
							<div className="flex items-center gap-3">
								<Avatar className="h-10 w-10 cursor-pointer ring-2 ring-stone-100 dark:ring-stone-800">
									<AvatarFallback className="bg-blue-700 dark:bg-blue-600 text-white text-sm font-semibold">KN</AvatarFallback>
								</Avatar>
								<div>
									<p className="text-sm font-semibold text-stone-900 dark:text-text-heading hover:underline cursor-pointer leading-tight">Kata Netizen</p>
									<div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
										<span>{detail.date}</span>
										<span className="text-stone-200 dark:text-stone-700">·</span>
										<span className="flex items-center gap-1">
											<BookOpen className="h-3 w-3" />
											{detail.readTime ? `${detail.readTime} menit` : "Analisis Sentimen"}
										</span>
									</div>
								</div>
							</div>
							<ShareButtons />
						</div>

						{/* Hero Image */}
						{detail.thumbnail && (
							<figure className="my-8">
								<div className="relative w-full aspect-16/8 overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
									<Image
										src={detail.thumbnail}
										alt={detail.title}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 896px"
										loading="eager"
										className="object-cover"
										priority
									/>
								</div>
							</figure>
						)}

						{/* Article Content — menggunakan ArticleBody ASLI */}
						<ArticleBody
							detailIsu={{
								judul: detail.title,
								konten: detail.konten,
								thumbnail: detail.thumbnail,
							}}
							analysis={detail.analysis}
						/>

						{/* Tags */}
						{detail.kata_kunci && (
							<div className="pt-8 mt-10 border-t border-stone-100 dark:border-border-subtle">
								<p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-3">Topik Terkait</p>
								<div className="flex flex-wrap gap-2">
									{detail.kata_kunci.split(",").map((t) => (
										<Badge
											key={t}
											variant="secondary"
											className="rounded-full capitalize bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-text-muted text-sm font-normal p-3 hover:bg-surface-hover dark:hover:bg-surface-hover cursor-pointer transition-colors"
										>
											{t.trim()}
										</Badge>
									))}
								</div>
							</div>
						)}

						<RelatedArticles recommended={recommended} />
					</div>

					{/* Sidebar Column (Desktop: lg+) */}
					<div className="hidden lg:flex flex-col w-64 shrink-0">
						<div className="sticky top-24 space-y-8 pl-8 border-stone-200 dark:border-stone-800">
							<TableOfContents />

							{trending.length > 0 && (
								<div className="border-t border-stone-100 dark:border-border-subtle pt-6">
									<p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-4">Trending</p>
									<div className="space-y-4">
										{trending.map((item, index) => (
											<Link key={index} href={item.slug} className="group flex gap-3 cursor-pointer">
												<span className="text-lg font-bold text-stone-200 dark:text-stone-700 leading-none mt-0.5 group-hover:text-stone-300 dark:group-hover:text-stone-500 transition-colors select-none shrink-0">{String(index + 1).padStart(2, "0")}</span>
												<div className="min-w-0">
													<h4 className="text-xs font-semibold text-stone-800 dark:text-text-body leading-snug line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{item.title}</h4>
													<span className="text-[11px] text-stone-400 dark:text-text-faint mt-0.5 block">{item.date}</span>
												</div>
											</Link>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>

			{/* Mobile: TOC & Trending Buttons */}
			<div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
				<MobileSidebar trending={trending} />
				<BackToTop />
			</div>

			<Footer />
		</div>
	);
}
