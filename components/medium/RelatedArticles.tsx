import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RECOMMENDED } from "@/data/recommended";

export interface RelatedPost {
	title: string;
	excerpt: string;
	tag: string;
	date: string;
	thumbnail?: string;
	slug?: string;
}

function RelatedCard({ post }: { post: RelatedPost }) {
	return (
		<article className="group cursor-pointer">
			{post.thumbnail && (
				<Link href={post.slug ?? "#"}>
					<div className="relative w-full aspect-video rounded-xl overflow-hidden bg-stone-100 mb-3">
						<Image
							src={post.thumbnail}
							alt={post.title}
							fill
							className="object-cover group-hover:scale-105 transition-transform duration-500"
						/>
					</div>
				</Link>
			)}
			<Link href={post.slug ?? "#"}>
				<h4 className="font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-stone-600 transition-colors mb-1">{post.title}</h4>
				<p className="text-sm text-stone-500 line-clamp-2 leading-relaxed hidden sm:block">{post.excerpt}</p>
			</Link>
			<div className="flex items-center justify-between mt-2">
				<div className="flex items-center gap-2 text-xs text-stone-400 font-sans">
					<span>{post.date}</span>
					<Badge
						variant="secondary"
						className="rounded-full bg-stone-100 text-stone-500 text-[11px] h-5 px-2 font-normal"
					>
						{post.tag}
					</Badge>
				</div>
			</div>
		</article>
	);
}

export function RelatedArticles() {
	return (
		<div className="mt-2 space-y-12">
			<section>
				<h2 className="text-lg font-bold text-stone-900 my-6 pt-4 border-t border-stone-200">Artikel Lainnya</h2>
				<div className="space-y-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
						{RECOMMENDED.slice(0, 2).map((p, index) => (
							<RelatedCard
								key={index}
								post={p}
							/>
						))}
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
						{RECOMMENDED.slice(2).map((p, index) => (
							<RelatedCard
								key={index}
								post={p}
							/>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
