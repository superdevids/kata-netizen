import { Navbar } from "@/components/medium/Navbar";
import { Footer } from "@/components/medium/Footer";
import { TopicTabs } from "@/components/medium/TopicTabs";
import { ArticleCard } from "@/components/medium/ArticleCard";
import { Sidebar } from "@/components/medium/Sidebar";
import { MobileTrending } from "@/components/medium/MobileTrending";
import { getIsuList, getKategori, getTrending } from "@/lib/query";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ kategori?: string; search?: string }> }) {
	const { kategori, search } = await searchParams;
	const aktifTab = kategori ?? "Untuk Anda";
	const [isu, kategoriList, trending] = await Promise.all([getIsuList(kategori, search), getKategori(), getTrending(10)]);

	return (
		<div className="min-h-screen bg-white dark:bg-stone-900">
			<Navbar />
			<TopicTabs
				kategoriList={["Untuk Anda", ...kategoriList]}
				aktif={aktifTab}
			/>
			<main className="max-w-334 mx-auto px-6 py-8">
				{/* Mobile: Trending Modal */}
				<div className="lg:hidden mb-6">
					<MobileTrending trending={trending} />
				</div>

				<div className="flex gap-12">
					<div className="flex-1 min-w-0">
						{isu.length === 0 ? (
							<div className="text-center py-20">
								<p className="text-stone-400 dark:text-stone-500 text-sm">{search ? `Tidak ada hasil untuk "${search}"` : "Belum ada data isu."}</p>
								{search && <p className="text-xs text-stone-400 dark:text-stone-600 mt-2">Coba kata kunci lain atau <a href="/" className="text-blue-600 dark:text-blue-400 underline">kembali</a></p>}
							</div>
						) : (
							<>
								<section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
									{isu.slice(0, 2).map((a) => (
										<ArticleCard
											key={a.slug}
											title={a.title}
											excerpt={a.description}
											date={a.date}
											tag={a.kategori}
											thumbnail={a.thumbnail}
											variant="featured"
											slug={a.slug}
										/>
									))}
								</section>
								<div>
									{isu.slice(2).map((a) => (
										<ArticleCard
											key={a.slug}
											title={a.title}
											excerpt={a.description}
											date={a.date}
											tag={a.kategori}
											thumbnail={a.thumbnail}
											variant="default"
											slug={a.slug}
										/>
									))}
								</div>
							</>
						)}
					</div>

					{/* Desktop: Sidebar */}
					<div className="hidden lg:block w-84 shrink-0">
						<div className="sticky top-28">
							<Sidebar trending={trending} />
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
