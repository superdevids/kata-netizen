import { Navbar } from "@/components/medium/Navbar";
import { TopicTabs } from "@/components/medium/TopicTabs";
import { ArticleCard } from "@/components/medium/ArticleCard";
import { Sidebar } from "@/components/medium/Sidebar";
import { getIsu, getKategori } from "@/lib/query";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ kategori?: string }> }) {
	const { kategori } = await searchParams;
	const aktifTab = kategori ?? "Untuk Anda";
	const [isu, kategoriList] = await Promise.all([getIsu(kategori), getKategori()]);

	return (
		<div className="min-h-screen bg-white">
			<Navbar />
			<TopicTabs
				kategoriList={["Untuk Anda", ...kategoriList]}
				aktif={aktifTab}
			/>
			<main className="max-w-334 mx-auto px-6 py-8">
				<div className="flex gap-12">
					<div className="flex-1 min-w-0">
						{isu.length === 0 ? (
							<p className="text-stone-400 text-sm text-center py-20">Belum ada data isu.</p>
						) : (
							<>
								<section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
									{isu.slice(0, 2).map((a, index) => (
										<ArticleCard
											key={index}
											id={index}
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
									{isu.slice(2).map((a, index) => (
										<ArticleCard
											key={index}
											id={index}
											title={a.title}
											excerpt={a.description}
											date={a.date}
											tag={a.kategori}
											thumbnail={a.thumbnail}
											variant="featured"
											slug={a.slug}
										/>
									))}
								</div>
								<div className="mt-10 text-center">
									<button className="text-sm text-stone-600 hover:text-stone-700 border border-stone-600 hover:border-stone-700 rounded-full px-6 py-2 transition-colors cursor-pointer">Lanjut...</button>
								</div>
							</>
						)}
					</div>
					<div className="hidden lg:block w-84 shrink-0">
						<div className="sticky top-28">
							<Sidebar />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
