"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LiveClock } from "./LiveClock";
import { navLinks } from "@/data/site";

export function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const { theme, setTheme, systemTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const handler = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", handler);
		return () => window.removeEventListener("scroll", handler);
	}, []);

	useEffect(() => setMounted(true), []);

	const currentTheme = theme === "system" ? systemTheme : theme;

	const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && searchQuery.trim()) {
			router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
			setShowSearch(false);
			setSearchQuery("");
		}
	};

	return (
		<header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800 shadow-sm" : "bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800"}`}>
			<div className="max-w-334 mx-auto px-6 h-14 flex items-center justify-between gap-4">
				{/* ========= Left Navigation ========= */}
				<div className="flex items-center gap-6">
					<Link
						href="/"
						className="shrink-0 flex items-center gap-2.5 group"
					>
						<Image
							src="/logo.png"
							alt="Kata Netizen"
							width={32}
							height={32}
							className="w-8 h-8"
						/>
						<span className="font-bold text-lg text-blue-700 dark:text-blue-400">
							Kata Netizen
						</span>
					</Link>

					<nav className="hidden lg:flex items-center gap-1">
						{navLinks.map((item, index) => (
							<Link
								key={index}
								href={item.href}
								className="text-sm text-stone-600 dark:text-stone-400 hover:text-blue-700 dark:hover:text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-nowrap"
							>
								{item.title}
							</Link>
						))}
					</nav>
				</div>

				{/* ========= Right Navigation ========= */}
				<div className="flex items-center gap-2">
					{/* Theme Toggle */}
					{mounted && (
						<div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-full p-0.5">
							<button
								onClick={() => setTheme("light")}
								className={`p-1.5 rounded-full transition-colors cursor-pointer ${currentTheme === "light" ? "bg-white dark:bg-stone-700 text-blue-700 dark:text-blue-400 shadow-sm" : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"}`}
								title="Light mode"
							>
								<Sun className="h-3.5 w-3.5" />
							</button>
							<button
								onClick={() => setTheme("dark")}
								className={`p-1.5 rounded-full transition-colors cursor-pointer ${currentTheme === "dark" ? "bg-stone-700 text-blue-400 shadow-sm" : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"}`}
								title="Dark mode"
							>
								<Moon className="h-3.5 w-3.5" />
							</button>

						</div>
					)}

					{showSearch ? (
						<div className="relative animate-in slide-in-from-right-4 duration-200">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 lg:h-3.5 lg:w-3.5 text-stone-400" />
							<Input
								autoFocus
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyDown={handleSearch}
								onBlur={() => { if (!searchQuery.trim()) setShowSearch(false); }}
								placeholder="Cari isu..."
								className="pl-9 pr-4 h-8 lg:h-7 w-20 lg:w-48 text-sm rounded-full border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus-visible:ring-blue-400 focus-visible:ring-1 focus-visible:w-36 md:focus-visible:w-64"
							/>
						</div>
					) : (
						<button
							onClick={() => setShowSearch(true)}
							className="p-2 lg:p-1.5 cursor-pointer rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 focus-visible:ring-2 focus-visible:ring-blue-400 lg:p-1"
						>
							<Search className="size-4 lg:size-3.5" />
						</button>
					)}
					<LiveClock />
				</div>
			</div>
		</header>
	);
}
