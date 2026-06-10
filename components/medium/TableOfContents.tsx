"use client";

import { useEffect, useState } from "react";

interface HeadingItem {
	id: string;
	text: string;
	level: number;
}

export function TableOfContents({ header = true, ...props }) {
	const [headings, setHeadings] = useState<HeadingItem[]>([]);
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		const article = document.getElementById("article-body");
		if (!article) return;

		const elements = article.querySelectorAll("h2, h3");
		const items: HeadingItem[] = [];

		const NAVBAR_OFFSET_PX = 72; // h-14 (56px) + 16px breathing room

		elements.forEach((el) => {
			if (!el.id) {
				el.id = el.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ?? `section-${items.length}`;
			}
			(el as HTMLElement).style.scrollMarginTop = `${NAVBAR_OFFSET_PX}px`;
			items.push({
				id: el.id,
				text: el.textContent ?? "",
				level: parseInt(el.tagName[1]),
			});
		});

		setHeadings(items);

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				}
			},
			{ rootMargin: "-72px 0px -70% 0px", threshold: 0 }
		);

		elements.forEach((el) => observer.observe(el));

		// Track when user is near the top so "Judul" highlights
		const handleScroll = () => {
			if (window.scrollY < 200) setActiveId("top");
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	if (headings.length === 0) return null;

	return (
		<nav className="space-y-1">
			{header &&
				<p className="text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3">Daftar Isi</p>
			}
			<ul className="space-y-0.5 border-l-2 border-stone-100 dark:border-stone-800">
				{/* "Judul" — scroll to top */}
				<li>
					<a
						href="#"
						onClick={(e) => {
							e.preventDefault();
							window.scrollTo({ top: 0, behavior: "smooth" });
						}}
						className={`block text-xs leading-relaxed pl-4 py-1.5 transition-colors ${activeId === "top"
							? "text-stone-900 dark:text-stone-100 font-medium border-l-2 -ml-[2px] border-blue-600 dark:border-blue-400"
							: "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 border-l-2 -ml-[2px] border-transparent"
							}`}
					>
						Judul
					</a>
				</li>
				{headings.map((h) => (
					<li key={h.id}>
						<a
							href={`#${h.id}`}
							onClick={(e) => {
								e.preventDefault();
								document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
							}}
							className={`block text-xs leading-relaxed transition-colors ${h.level === 3 ? "pl-7" : "pl-4"} py-1.5 ${activeId === h.id
								? "text-stone-900 dark:text-stone-100 font-medium border-l-2 -ml-[2px] border-blue-600 dark:border-blue-400"
								: "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 border-l-2 -ml-[2px] border-transparent"
								}`}
						>
							{h.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
