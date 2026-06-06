"use client";

import { useEffect, useState, useCallback } from "react";

export function ArticleProgress() {
	const [progress, setProgress] = useState(0);

	const handleScroll = useCallback(() => {
		const el = document.getElementById("article-body");
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const total = el.offsetHeight - window.innerHeight;
		const scrolled = -rect.top;
		const pct = Math.min(Math.max((scrolled / total) * 100, 0), 100);
		setProgress(pct);
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	return (
		<div className="fixed top-0 left-0 right-0 z-60 h-0.5 bg-stone-100">
			<div
				className="h-full bg-stone-800 transition-all duration-75 ease-out"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}
