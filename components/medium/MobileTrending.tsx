"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/medium/Sidebar";
import type { TrendingItem } from "@/lib/query";

interface MobileTrendingProps {
	trending: TrendingItem[];
}

export function MobileTrending({ trending }: MobileTrendingProps) {
	const [open, setOpen] = useState(false);

	// Auto-close modal when viewport changes to desktop (lg: 1024px)
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setOpen(false);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button className="w-full group flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800/50 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-950/50 dark:hover:to-indigo-950/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
							<TrendingUp className="h-5 w-5 text-white" />
						</div>
						<div className="text-left">
							<span className="block text-lg font-bold text-stone-900 dark:text-stone-100">TRENDING DI KATA NETIZEN</span>
						</div>
					</div>
					<svg className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</SheetTrigger>
			<SheetContent side="right" className="w-[85vw] sm:max-w-md bg-white dark:bg-stone-900">
				<SheetHeader className="border-b border-stone-200 dark:border-stone-800 pb-4">
					<div className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
						<SheetTitle className="text-sm font-semibold text-stone-800 dark:text-stone-200 tracking-wide uppercase">
							TRENDING DI KATA NETIZEN
						</SheetTitle>
					</div>
					<SheetDescription className="sr-only">
						Daftar topik yang sedang trending di Kata Netizen
					</SheetDescription>
				</SheetHeader>
				<div className="px-4">
					<Sidebar header={false} trending={trending} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
