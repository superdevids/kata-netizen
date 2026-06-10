import { NextRequest } from "next/server";
import { createHash } from "crypto";

const PASSWORD_HASH = process.env.API_PASSWORD_HASH || "";

/**
 * Verify API password from X-API-Key header.
 * User sends plaintext → we SHA-256 hash it → compare against API_PASSWORD_HASH in .env
 *
 * Usage in route:
 *   const authErr = checkAuth(request);
 *   if (authErr) return authErr;
 */
export function checkAuth(request: NextRequest): Response | null {
	const key = request.headers.get("x-api-key");

	if (!key) {
		return Response.json(
			{ error: "Missing X-API-Key header" },
			{ status: 401 }
		);
	}

	if (!PASSWORD_HASH) {
		return Response.json(
			{ error: "Server auth not configured" },
			{ status: 500 }
		);
	}

	const hash = createHash("sha256").update(key).digest("hex");

	if (hash !== PASSWORD_HASH) {
		return Response.json(
			{ error: "Invalid API key" },
			{ status: 403 }
		);
	}

	return null; // auth passed
}

/**
 * Check if request has admin access via query param `key`.
 * Used for read-only endpoints where admin can see drafts/inactive items.
 * Returns true if the `key` query param matches API_PASSWORD_HASH.
 */
export function isAdmin(request: NextRequest): boolean {
	if (!PASSWORD_HASH) return false;
	const key = new URL(request.url).searchParams.get("key");
	if (!key) return false;
	const hash = createHash("sha256").update(key).digest("hex");
	return hash === PASSWORD_HASH;
}
