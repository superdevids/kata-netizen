"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface TopicTabsProps {
	kategoriList: string[];
	aktif: string;
}

export function TopicTabs({ kategoriList, aktif }: TopicTabsProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const searchParams = useSearchParams();

	function handleClick(kategori: string) {
		const params = new URLSearchParams(searchParams.toString());
		if (kategori === "Untuk Anda") {
			params.delete("kategori");
		} else {
			params.set("kategori", kategori);
		}
		router.push(`/?${params.toString()}`);
	}

	const scroll = (dir: "left" | "right") => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
		}
	};

	return (
		<div className="border-b border-stone-200 bg-white sticky top-14 z-40">
			<div className="max-w-334 mx-auto px-6 relative">
				{/* Left shadow + button */}
				<button
					onClick={() => scroll("left")}
					className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-1 pr-4 bg-linear-to-r from-white via-white/90 to-transparent cursor-pointer"
				>
					<ChevronLeft className="h-4 w-4 text-stone-500" />
				</button>

				<div
					ref={scrollRef}
					className="flex items-center gap-0.5 overflow-x-auto scrollbar-none px-6"
					style={{ scrollbarWidth: "none" }}
				>
					{kategoriList.map((kategori) => (
						<button
							key={kategori}
							onClick={() => handleClick(kategori)}
							className={cn("shrink-0 px-3 py-3 text-sm transition-all duration-150 whitespace-nowrap border-b-2 cursor-pointer", aktif === kategori ? "border-stone-800 text-stone-900 font-medium" : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300")}
						>
							{kategori}
						</button>
					))}
				</div>

				{/* Right shadow + button */}
				<button
					onClick={() => scroll("right")}
					className="absolute right-0 top-0 bottom-0 z-10 flex items-center pr-1 pl-4 bg-linear-to-l from-white via-white/90 to-transparent cursor-pointer"
				>
					<ChevronRight className="h-4 w-4 text-stone-500" />
				</button>
			</div>
		</div>
	);
}
