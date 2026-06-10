import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface ArticleCardProps {
	id?: number;
	title: string;
	excerpt: string;
	date: Date | string;
	tag?: string;
	thumbnail?: string;
	variant?: "featured" | "default";
	slug?: string;
}

export function ArticleCard({ title, excerpt, date, tag, thumbnail, variant = "default", slug = "/" }: ArticleCardProps) {
	if (variant === "featured") {
		return (
			<Link
				href={slug}
				className="shrink-0"
			>
				<article className="group relative overflow-hidden rounded-lg bg-stone-900 text-white aspect-video cursor-pointer">
					{thumbnail && (
						<Image
							src={thumbnail}
							alt={title}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							loading="eager"
							className="object-cover opacity-50 group-hover:opacity-40 duration-500 group-hover:scale-105 transition-transform "
						/>
					)}
					<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
					<div className="relative h-full flex flex-col justify-end p-6">
						<h2 className="text-xl font-bold leading-snug mb-2 line-clamp-3">{title}</h2>
						<div className="flex items-center gap-2 mb-3">
							<Avatar className="h-6 w-6 border border-white/30">
								<AvatarFallback className="text-[10px] bg-blue-600 dark:bg-blue-500 text-white">KN</AvatarFallback>
							</Avatar>
							<span className="text-sm text-white/80">Kata Netizen - {typeof date === "string" ? date : date.toLocaleDateString()}</span>
						</div>
					</div>
				</article>
			</Link>
		);
	}

	return (
		<article
			className="group py-6 border-b border-stone-100 dark:border-stone-800 last:border-0"
		>
			<div className="flex gap-6 items-start">
				<div className="flex-1 min-w-0">
					<Link href={slug}>
						<h2 className={cn("font-bold leading-snug mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2", "text-stone-900 dark:text-stone-100 text-base sm:text-lg")}>{title}</h2>
						<p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2 hidden sm:block">{excerpt}</p>
					</Link>
					<div className="flex items-center justify-between mt-3">
						<div className="flex items-center gap-2 text-xs text-stone-400 flex-wrap">
							<div className="flex items-center gap-2">
								<Avatar className="h-5 w-5">
									<AvatarFallback className="text-[9px] bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400">KN</AvatarFallback>
								</Avatar>
								<span className="text-xs text-stone-700 dark:text-stone-300 font-medium hover:underline cursor-pointer">Kata Netizen </span>
							</div>
							<span>{typeof date === "string" ? date : date.toLocaleDateString()}</span>
							{tag && (
								<Badge
									variant="secondary"
									className="text-[11px] px-2 py-0 h-5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer font-normal"
								>
									{tag}
								</Badge>
							)}
						</div>
					</div>
				</div>
				{thumbnail && (
					<Link
						href={slug}
						className="shrink-0"
					>
						<div className="relative w-24 aspect-video sm:w-60 sm:aspect-video rounded-lg overflow-hidden bg-stone-100">
							<Image
								src={thumbnail}
								alt={title}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								loading="eager"
								className="object-cover group-hover:scale-105 transition-transform duration-500"
							/>
						</div>
					</Link>
				)}
			</div>
		</article>
	);
}
