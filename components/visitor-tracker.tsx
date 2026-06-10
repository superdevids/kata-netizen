"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_KEY = "kn_visitor_id";
const SESSION_KEY = "kn_session_id";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for HTTP
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateId(): string {
	return generateUUID();
}

function getOrCreateVisitorId(): string {
	if (typeof window === "undefined") return "";
	let id = localStorage.getItem(STORAGE_KEY);
	if (!id) {
		id = generateId();
		localStorage.setItem(STORAGE_KEY, id);
	}
	return id;
}

function getOrCreateSessionId(): string {
	if (typeof window === "undefined") return "";
	const now = Date.now();
	const stored = sessionStorage.getItem(SESSION_KEY);
	const expiry = Number(sessionStorage.getItem(SESSION_KEY + "_exp"));

	if (stored && expiry && now < expiry) {
		// Refresh expiry
		sessionStorage.setItem(SESSION_KEY + "_exp", String(now + SESSION_TIMEOUT));
		return stored;
	}

	const id = generateId();
	sessionStorage.setItem(SESSION_KEY, id);
	sessionStorage.setItem(SESSION_KEY + "_exp", String(now + SESSION_TIMEOUT));
	return id;
}

/** Client component — logs every page view to /api/visitor-log */
export default function VisitorTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const visitor_id = getOrCreateVisitorId();
		const session_id = getOrCreateSessionId();
		const page_url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
		const referrer = document.referrer || "";

		// Fire-and-forget — don't block rendering
		fetch("/api/visitor-log", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ visitor_id, session_id, page_url, referrer }),
		}).catch(() => {
			// Silently fail — visitor logging should never break the UX
		});
	}, [pathname, searchParams]);

	return null;
}
