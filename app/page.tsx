import { Navbar } from "@/components/medium/Navbar";
import { Footer } from "@/components/medium/Footer";
import { TopicTabs } from "@/components/medium/TopicTabs";
import { Sidebar } from "@/components/medium/Sidebar";
import { MobileTrending } from "@/components/medium/MobileTrending";
import { InfiniteScrollArticles } from "@/components/medium/InfiniteScrollArticles";
import { getMdArticleListPaginated, getMdKategori, getMdTrending } from "@/lib/md-loader";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ kategori?: string; search?: string }> }) {
	const { kategori, search } = await searchParams;
	const aktifTab = kategori ?? "Untuk Anda";
	const [isuResult, kategoriList, trending] = await Promise.all([
		getMdArticleListPaginated(kategori, search, 10, 0),
		getMdKategori(),
		getMdTrending(10)
	]);

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
						<InfiniteScrollArticles
							key={`${aktifTab}-${search || ""}`}
							initialData={isuResult.data}
							initialNextCursor={isuResult.nextOffset !== null ? String(isuResult.nextOffset) : null}
							kategori={aktifTab}
							search={search}
						/>
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
