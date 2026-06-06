"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function LiveClock() {
	const [time, setTime] = useState("");
	useEffect(() => {
		const updateTime = () => {
			setTime(
				new Date().toLocaleTimeString("id-ID", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			);
		};
		updateTime();
		const interval = setInterval(updateTime, 60_000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="hidden sm:flex items-center gap-1.5 rounded-full border border-stone-300 px-3 h-8 text-sm text-stone-700 hover:bg-stone-50 transition-colors">
			<Clock className="h-3.5 w-3.5" />
			<span className="tabular-nums">{time} WIB</span>
		</div>
	);
}
