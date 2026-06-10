import Link from "next/link";
import { TrendingUp } from "lucide-react";
import type { TrendingItem } from "@/lib/query";

interface SidebarProps {
	header?: boolean;
	trending?: TrendingItem[];
}

export function Sidebar({ header = true, trending = [] }: SidebarProps) {
	return (
		<aside className="space-y-10">
			<div>
				{header &&
					<div className="flex items-center gap-2 mb-5">
						<TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
						<h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 tracking-wide uppercase">TRENDING DI KATA NETIZEN</h3>
					</div>
				}
				{trending.length > 0 ? (
					<div className="space-y-5">
						{trending.map((item, index) => (
							<Link key={index} href={item.slug} className="group flex gap-4 cursor-pointer">
								<span className="text-2xl font-bold text-stone-200 dark:text-stone-700 leading-none mt-0.5 group-hover:text-blue-300 dark:group-hover:text-blue-600 transition-colors select-none">{String(index + 1).padStart(2, "0")}</span>
								<div className="min-w-0">
									<h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{item.title}</h4>
									<div className="flex items-center gap-1.5 mt-1 text-xs text-stone-400">
										<span>Kata Netizen</span>
										<span>·</span>
										<span>{item.date}</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<p className="text-xs text-stone-400 dark:text-stone-500">Belum ada data trending.</p>
				)}
			</div>
		</aside>
	);
}
