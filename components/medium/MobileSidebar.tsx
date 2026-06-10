"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TableOfContents, TrendingUp } from "lucide-react";
import { TableOfContents as DaftarIsi } from "./TableOfContents";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { TrendingItem } from "@/lib/query";

interface MobileSidebarProps {
	trending: TrendingItem[];
}

export function MobileSidebar({ trending }: MobileSidebarProps) {
	const [tocOpen, setTocOpen] = useState(false);
	const [trendingOpen, setTrendingOpen] = useState(false);

	// Auto-close modals when viewport changes to desktop (lg: 1024px)
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setTocOpen(false);
				setTrendingOpen(false);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="lg:hidden flex flex-col gap-3 top-20">
			{/* Table of Contents Modal */}
			<Sheet open={tocOpen} onOpenChange={setTocOpen}>
				<SheetTrigger asChild>
					<button className="p-3 rounded-full bg-white dark:bg-stone-800 shadow-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 transition-all duration-200 hover:scale-110 cursor-pointer">
						<TableOfContents className="h-4 w-4 text-blue-600 dark:text-blue-400" />
					</button>
				</SheetTrigger>
				<SheetContent side="left" className="w-[85vw] sm:max-w-sm bg-white dark:bg-stone-900">
					<SheetHeader className="border-b border-stone-200 dark:border-stone-800 pb-4">
						<div className="flex items-center gap-2">
							<TableOfContents className="h-5 w-5 text-blue-600 dark:text-blue-400" />
							<SheetTitle className="text-sm font-semibold text-stone-800 dark:text-stone-200">
								Daftar Isi
							</SheetTitle>
						</div>
						<SheetDescription className="sr-only">
							Navigasi cepat ke bagian artikel
						</SheetDescription>
					</SheetHeader>
					<div className="px-4">
						<DaftarIsi header={false}/>
					</div>
				</SheetContent>
			</Sheet>

			{/* Trending Modal */}
			<Sheet open={trendingOpen} onOpenChange={setTrendingOpen}>
				<SheetTrigger asChild>
					<button className="p-3 rounded-full bg-white dark:bg-stone-800 shadow-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 transition-all duration-200 hover:scale-110 cursor-pointer">
						<TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
					</button>
				</SheetTrigger>
				<SheetContent side="right" className="w-[85vw] sm:max-w-sm bg-white dark:bg-stone-900">
					<SheetHeader className="border-b border-stone-200 dark:border-stone-800 pb-4">
						<div className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
							<SheetTitle className="text-sm font-semibold text-stone-800 dark:text-stone-200 tracking-wide uppercase">
								TRENDING DI KATA NETIZEN
							</SheetTitle>
						</div>
						<SheetDescription className="sr-only">
							Daftar topik yang sedang trending
						</SheetDescription>
					</SheetHeader>
					<div className="px-4">
						{trending.length > 0 ? (
							<div className="space-y-5">
								{trending.map((item, index) => (
									<Link
										key={index}
										href={item.slug}
										className="group flex gap-4 cursor-pointer"
										onClick={() => setTrendingOpen(false)}
									>
										<span className="text-2xl font-bold text-stone-200 dark:text-stone-700 leading-none mt-0.5 group-hover:text-blue-300 dark:group-hover:text-blue-600 transition-colors select-none">
											{String(index + 1).padStart(2, "0")}
										</span>
										<div className="min-w-0">
											<h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
												{item.title}
											</h4>
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
				</SheetContent>
			</Sheet>
		</div>
	);
}
