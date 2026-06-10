/**
 * In-memory cache with TTL (Time To Live)
 * Optimized for high-traffic scenarios (100-5000 users/hour)
 * Reduces database load by caching frequently accessed data
 */

interface CacheEntry<T> {
	data: T;
	expiry: number;
	created: number;
}

interface CacheOptions {
	ttl?: number; // Time to live in milliseconds
	maxSize?: number; // Maximum number of entries
}

const DEFAULT_TTL = 60 * 1000; // 1 minute
const DEFAULT_MAX_SIZE = 100; // Max 100 entries

class InMemoryCache {
	private cache: Map<string, CacheEntry<any>>;
	private maxSize: number;

	constructor(maxSize: number = DEFAULT_MAX_SIZE) {
		this.cache = new Map();
		this.maxSize = maxSize;
	}

	/**
	 * Get cached data if exists and not expired
	 */
	get<T>(key: string): T | null {
		const entry = this.cache.get(key);

		if (!entry) {
			return null;
		}

		// Check if expired
		if (Date.now() > entry.expiry) {
			this.cache.delete(key);
			return null;
		}

		return entry.data as T;
	}

	/**
	 * Set data in cache with TTL
	 */
	set<T>(key: string, data: T, options: CacheOptions = {}): void {
		const ttl = options.ttl ?? DEFAULT_TTL;

		// Evict oldest entry if cache is full
		if (this.cache.size >= this.maxSize) {
			const oldestKey = this.cache.keys().next().value;
			if (oldestKey) {
				this.cache.delete(oldestKey);
			}
		}

		this.cache.set(key, {
			data,
			expiry: Date.now() + ttl,
			created: Date.now(),
		});
	}

	/**
	 * Delete specific cache entry
	 */
	delete(key: string): boolean {
		return this.cache.delete(key);
	}

	/**
	 * Clear all cache entries
	 */
	clear(): void {
		this.cache.clear();
	}

	/**
	 * Get cache statistics
	 */
	getStats(): { size: number; maxSize: number; keys: string[] } {
		return {
			size: this.cache.size,
			maxSize: this.maxSize,
			keys: Array.from(this.cache.keys()),
		};
	}

	/**
	 * Clean expired entries
	 */
	cleanup(): void {
		const now = Date.now();
		for (const [key, entry] of this.cache.entries()) {
			if (now > entry.expiry) {
				this.cache.delete(key);
			}
		}
	}
}

// Singleton cache instance
export const cache = new InMemoryCache(200); // Increased to 200 entries for high traffic

// Cache keys helper
export const CACHE_KEYS = {
	ISU_LIST: (kategori?: string, search?: string) => `isu_list:${kategori || "all"}:${search || "none"}`,
	TRENDING: (limit: number) => `trending:${limit}`,
	KATEGORI: "kategori",
	RECOMMENDED: (slug: string, limit: number) => `recommended:${slug}:${limit}`,
	ISU_DETAIL: (slug: string) => `isu_detail:${slug}`,
};

/**
 * Invalidate specific cache entries
 * Call this when data is created/updated/deleted
 */
export function invalidateCache(pattern?: string): void {
	if (!pattern) {
		// Clear all cache
		cache.clear();
		return;
	}

	// Delete matching keys
	for (const key of cache.getStats().keys) {
		if (key.includes(pattern)) {
			cache.delete(key);
		}
	}
}

/**
 * Invalidate all analysis-related caches (when Isu is updated)
 */
export function invalidateIsuCache(slug: string): void {
	cache.delete(CACHE_KEYS.ISU_DETAIL(slug));
	cache.delete(CACHE_KEYS.ISU_LIST());
	cache.delete(CACHE_KEYS.TRENDING(10));
	cache.delete(CACHE_KEYS.RECOMMENDED(slug, 5));
}

/**
 * Invalidate list caches (when new Isu is created)
 */
export function invalidateListCache(): void {
	cache.delete(CACHE_KEYS.KATEGORI);
	cache.delete(CACHE_KEYS.ISU_LIST());
	cache.delete(CACHE_KEYS.TRENDING(10));
}

// Auto cleanup every 30 minutes (for data that rarely changes)
if (typeof global !== "undefined") {
	setInterval(() => {
		cache.cleanup();
	}, 30 * 60 * 1000); // 30 minutes
}
