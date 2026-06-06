import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { TRENDING } from "@/data/trending";

export function Sidebar() {
	return (
		<aside className="space-y-10">
			<div>
				<div className="flex items-center gap-2 mb-5">
					<TrendingUp className="h-4 w-4 text-stone-700" />
					<h3 className="text-sm font-semibold text-stone-800 tracking-wide uppercase">Trending di Kata Netizen</h3>
				</div>
				<div className="space-y-5">
					{TRENDING.map((item, index) => (
						<div
							key={index}
							className="group flex gap-4 cursor-pointer"
						>
							<span className="text-2xl font-bold text-stone-200 leading-none mt-0.5 group-hover:text-stone-300 transition-colors select-none">{String(index + 1).padStart(2, "0")}</span>
							<div className="min-w-0">
								<h4 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-stone-600 transition-colors">{item.title}</h4>
								<div className="flex items-center gap-1.5 mt-1 text-xs text-stone-400">
									<span>Kata Netizen</span>
									<span>·</span>
									<span>{item.date}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="border-t border-stone-100" />
			<div className="flex flex-wrap gap-x-3 gap-y-1">
				{[
					{ name: "Help", href: "#" },
					{ name: "About", href: "#" },
					{ name: "Blog", href: "#" },
					{ name: "Privacy", href: "#" },
					{ name: "Terms", href: "#" },
					{ name: "Teams", href: "#" },
				].map((item, index) => (
					<Link
						key={index}
						href={item.href}
						className="text-xs text-stone-400 hover:text-stone-800 transition-colors"
					>
						{item.name}
					</Link>
				))}
			</div>
		</aside>
	);
}
