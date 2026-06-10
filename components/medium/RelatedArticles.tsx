import Image from "next/image";
import Link from "next/link";
import type { TrendingItem } from "@/lib/query";

interface RelatedArticlesProps {
	recommended?: TrendingItem[];
}

export function RelatedArticles({ recommended = [] }: RelatedArticlesProps) {
	if (recommended.length === 0) return null;

	return (
		<div className="mt-2 space-y-12">
			<section>
				<h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 my-6 pt-4 border-t border-stone-200 dark:border-stone-800">Artikel Lainnya</h2>
				<div className="space-y-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
						{recommended.slice(0, 2).map((p, index) => (
							<RelatedCard key={index} post={p} />
						))}
					</div>
					{recommended.length > 2 && (
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
							{recommended.slice(2).map((p, index) => (
								<RelatedCard key={index} post={p} />
							))}
						</div>
					)}
				</div>
			</section>
		</div>
	);
}

function RelatedCard({ post }: { post: TrendingItem }) {
	return (
		<article className="group cursor-pointer">
			{post.thumbnail && (
				<Link href={post.slug}>
					<div className="relative w-full aspect-video rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 mb-3">
						<Image
							src={post.thumbnail}
							alt={post.title}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-cover group-hover:scale-105 transition-transform duration-500"
						/>
					</div>
				</Link>
			)}
			<Link href={post.slug}>
				<h4 className="font-bold text-stone-900 dark:text-stone-100 leading-snug line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors mb-1">{post.title}</h4>
			</Link>
			<div className="flex items-center gap-2 text-xs text-stone-400 font-sans mt-2">
				<span>{post.date}</span>
			</div>
		</article>
	);
}
