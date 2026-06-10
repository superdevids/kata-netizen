"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ArticleCard } from "./ArticleCard";
import type { IsuListItem } from "@/lib/query";

interface InfiniteScrollArticlesProps {
	initialData: IsuListItem[];
	initialNextCursor: string | null;
	kategori?: string;
	search?: string;
}

export function InfiniteScrollArticles({
	initialData,
	initialNextCursor,
	kategori,
	search,
}: InfiniteScrollArticlesProps) {
	const [articles, setArticles] = useState<IsuListItem[]>(initialData);
	const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
	const [loading, setLoading] = useState(false);
	const [hasError, setHasError] = useState(false);
	const observer = useRef<IntersectionObserver | null>(null);
	const loaderRef = useRef<HTMLDivElement | null>(null);

	const loadMore = useCallback(async () => {
		if (loading || !nextCursor) return;

		setLoading(true);
		setHasError(false);

		try {
			const params = new URLSearchParams();
			if (kategori && kategori !== "Untuk Anda") params.set("kategori", kategori);
			if (search) params.set("search", search);
			if (nextCursor) params.set("cursor", nextCursor);
			params.set("limit", "10");

			const response = await fetch(`/api/isu-paginated?${params.toString()}`);
			if (!response.ok) throw new Error("Failed to fetch");

			const data = await response.json();
			
			setArticles((prev) => [...prev, ...data.data]);
			setNextCursor(data.nextCursor);
		} catch (error) {
			console.error("Error loading more articles:", error);
			setHasError(true);
		} finally {
			setLoading(false);
		}
	}, [nextCursor, loading, kategori, search]);

	useEffect(() => {
		if (observer.current) observer.current.disconnect();

		observer.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && nextCursor && !loading) {
				loadMore();
			}
		});

		if (loaderRef.current) {
			observer.current.observe(loaderRef.current);
		}

		return () => {
			if (observer.current) observer.current.disconnect();
		};
	}, [nextCursor, loading, loadMore]);

	if (articles.length === 0) {
		return (
			<div className="text-center py-20">
				<p className="text-stone-400 dark:text-stone-500 text-sm">
					{search ? `Tidak ada hasil untuk "${search}"` : "Belum ada data isu."}
				</p>
				{search && (
					<p className="text-xs text-stone-400 dark:text-stone-600 mt-2">
						Coba kata kunci lain atau{" "}
						<a href="/" className="text-blue-600 dark:text-blue-400 underline">
							kembali
						</a>
					</p>
				)}
			</div>
		);
	}

	return (
		<>
			{/* Featured articles (first 2) */}
			<section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
				{articles.slice(0, 2).map((a) => (
					<ArticleCard
						key={a.slug}
						title={a.title}
						excerpt={a.description}
						date={a.date}
						tag={a.kategori}
						thumbnail={a.thumbnail}
						variant="featured"
						slug={a.slug}
					/>
				))}
			</section>

			{/* Regular articles (from 3rd onwards) */}
			<div>
				{articles.slice(2).map((a) => (
					<ArticleCard
						key={a.slug}
						title={a.title}
						excerpt={a.description}
						date={a.date}
						tag={a.kategori}
						thumbnail={a.thumbnail}
						variant="default"
						slug={a.slug}
					/>
				))}
			</div>

			{/* Loading indicator */}
			<div
				ref={loaderRef}
				className="py-8 text-center"
			>
				{loading && (
					<div className="flex flex-col items-center gap-3">
						<div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
						<p className="text-sm text-stone-500 dark:text-stone-400">Memuat artikel lainnya...</p>
					</div>
				)}
				{hasError && !loading && (
					<div className="text-center">
						<p className="text-sm text-red-500 mb-2">Gagal memuat artikel</p>
						<button
							onClick={loadMore}
							className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
						>
							Coba lagi
						</button>
					</div>
				)}
				{!nextCursor && !loading && articles.length > 0 && (
					<p className="text-sm text-stone-400 dark:text-stone-500">
						Semua artikel sudah ditampilkan
					</p>
				)}
			</div>
		</>
	);
}
