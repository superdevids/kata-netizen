"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LiveClock } from "./LiveClock";

export function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [showSearch, setShowSearch] = useState(false);

	useEffect(() => {
		const handler = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", handler);
		return () => window.removeEventListener("scroll", handler);
	}, []);

	return (
		<header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white backdrop-blur-sm border-b border-stone-200 shadow-sm" : "bg-white border-b border-stone-200"}`}>
			<div className="max-w-334 mx-auto px-6 h-14 flex items-center justify-between gap-4">
				{/* ========= Left Navigation ========= */}
				<div className="flex items-center gap-6">
					<Link
						href="/"
						className="shrink-0 font-semibold text-lg text-stone-900 tracking-tight capitalize"
					>
						Kata Netizen
					</Link>

					<nav className="hidden md:flex items-center gap-1">
						{[{ title: "Our story", href: "/about" }].map((item, index) => (
							<Link
								key={index}
								href={item.href}
								className="text-sm text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-full hover:bg-stone-100 transition-colors"
							>
								{item.title}
							</Link>
						))}
					</nav>
				</div>

				{/* ========= Right Navigation ========= */}
				<div className="flex items-center gap-2">
					{showSearch ? (
						<div className="relative animate-in slide-in-from-right-4 duration-200">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
							<Input
								autoFocus
								onBlur={() => setShowSearch(false)}
								placeholder="Search..."
								className="pl-9 pr-4 h-8 w-64 text-sm rounded-full border-stone-300 bg-stone-50 focus-visible:ring-stone-400 focus-visible:ring-1"
							/>
						</div>
					) : (
						<button
							onClick={() => setShowSearch(true)}
							className="p-2 cursor-pointer rounded-full hover:bg-stone-100 transition-colors text-stone-600 hover:text-stone-900"
						>
							<Search className="h-4 w-4" />
						</button>
					)}
					<LiveClock />
				</div>
			</div>
		</header>
	);
}
