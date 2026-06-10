"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export function NewsletterForm() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim() || status === "loading") return;

		setStatus("loading");
		try {
			const res = await fetch("/api/newsletter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email.trim() }),
			});
			const data = await res.json();
			if (res.ok) {
				setStatus("success");
				setMessage(data.message || "Berhasil berlangganan!");
				setEmail("");
			} else {
				setStatus("error");
				setMessage(data.error || "Terjadi kesalahan.");
			}
		} catch {
			setStatus("error");
			setMessage("Gagal terhubung ke server.");
		}

		setTimeout(() => {
			setStatus("idle");
			setMessage("");
		}, 5000);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Masukkan email Anda"
				required
				disabled={status === "loading"}
				className="w-full sm:flex-1 px-4 py-3 rounded-full text-sm bg-white/10 text-white placeholder:text-blue-300 border border-white/10 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 disabled:opacity-50"
			/>
			<button
				type="submit"
				disabled={status === "loading"}
				className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-blue-800 font-semibold text-sm px-6 py-3 rounded-full hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{status === "loading" ? (
					<Loader2 className="w-4 h-4 animate-spin" />
				) : status === "success" ? (
					<Check className="w-4 h-4" />
				) : (
					<>
						Langganan
						<ArrowRight className="w-4 h-4" />
					</>
				)}
			</button>
			{message && (
				<p className={`absolute -bottom-8 text-xs w-full text-center ${status === "success" ? "text-green-300" : "text-red-300"}`}>
					{message}
				</p>
			)}
		</form>
	);
}
