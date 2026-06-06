import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/medium/Navbar";
import { ArticleProgress } from "@/components/medium/ArticleProgress";
import { ArticleBody } from "@/components/medium/ArticleBody";
import { RelatedArticles } from "@/components/medium/RelatedArticles";
import { getIsuById } from "@/lib/query";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const [detailIsu] = await Promise.all([getIsuById(slug)]);
	if (!detailIsu) redirect("/");

	return (
		<div className="min-h-screen bg-white">
			<ArticleProgress />
			<Navbar />
			<main className="max-w-268 mx-auto px-6 pt-10 pb-32 lg:pb-16">
				<div className="flex gap-12">
					<div className="flex-1 min-w-0 max-w-268 mx-auto lg:mx-0">
						<h1 className="text-3xl sm:text-4xl font-bold leading-tight text-stone-900 mb-4">{detailIsu.title}</h1>
						<p className="text-xl text-stone-500 leading-relaxed mb-8">{detailIsu.description}</p>
						<div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-stone-100">
							<div className="flex items-center gap-3">
								<Avatar className="h-10 w-10 cursor-pointer">
									<AvatarFallback className="bg-stone-800 text-white text-sm">KN</AvatarFallback>
								</Avatar>
								<div>
									<p className="text-sm font-medium text-stone-900 hover:underline cursor-pointer font-sans leading-tight">Kata Netizen</p>
									<div className="flex items-center gap-1.5 text-xs text-stone-400 font-sans mt-0.5">
										<span>{detailIsu?.date}</span>
									</div>
								</div>
							</div>
						</div>
						<div className="mt-8">
							<ArticleBody detailIsu={{ judul: detailIsu.title, konten: detailIsu.konten, thumbnail: detailIsu.thumbnail }} />
						</div>
						<div className="flex flex-wrap gap-2 mt-10">
							{detailIsu?.kata_kunci?.split(",").map((t) => (
								<Badge
									key={t}
									variant="secondary"
									className="rounded-full capitalize bg-stone-100 text-stone-600 text-sm font-normal p-3 hover:bg-stone-200 cursor-pointer transition-colors"
								>
									{t}
								</Badge>
							))}
						</div>
						<RelatedArticles />
					</div>
				</div>
			</main>
		</div>
	);
}
