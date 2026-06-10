"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handler = () => setVisible(window.scrollY > 600);
		window.addEventListener("scroll", handler, { passive: true });
		return () => window.removeEventListener("scroll", handler);
	}, []);

	if (!visible) return null;

	return (
		<button
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			className="p-3 rounded-full bg-blue-700 dark:bg-blue-600 text-white shadow-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-300 hover:scale-110 cursor-pointer"
			title="Kembali ke atas"
		>
			<ArrowUp className="h-4 w-4" />
		</button>
	);
}
