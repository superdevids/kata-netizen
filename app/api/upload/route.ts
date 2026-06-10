import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { checkAuth } from "@/lib/auth";

const ALLOWED_MIME = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"image/svg+xml",
]);

const ALLOWED_FOLDER = new Set(["isu"]);

/** Sanitize filename: keep extension, slugify the rest */
function safeName(raw: string): string {
	const ext = path.extname(raw).toLowerCase();
	const base = path.basename(raw, ext);
	const slug = base
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
		.slice(0, 80);
	return `${slug || "img"}${ext}`;
}

export async function POST(request: NextRequest) {
	try {
		const authErr = checkAuth(request);
		if (authErr) return authErr;

		const form = await request.formData();
		const file = form.get("file") as File | null;
		const folder = (form.get("folder") as string) || "isu";

		if (!file || !(file instanceof File)) {
			return Response.json({ error: "Missing required field: file" }, { status: 400 });
		}

		if (!ALLOWED_MIME.has(file.type)) {
			return Response.json(
				{ error: `Unsupported file type: ${file.type}. Allowed: jpeg, png, webp, gif, svg` },
				{ status: 400 }
			);
		}

		if (!ALLOWED_FOLDER.has(folder)) {
			return Response.json(
				{ error: `Invalid folder: ${folder}. Allowed: ${[...ALLOWED_FOLDER].join(", ")}` },
				{ status: 400 }
			);
		}

		const filename = safeName(file.name);
		const dir = path.join(process.cwd(), "public", folder);
		await mkdir(dir, { recursive: true });

		const filePath = path.join(dir, filename);
		const buffer = Buffer.from(await file.arrayBuffer());
		await writeFile(filePath, buffer);

		const url = `/${folder}/${filename}`;

		return Response.json({ success: true, url, filename, size: file.size, type: file.type }, { status: 201 });
	} catch (err: any) {
		return Response.json({ error: err.message || "Upload failed" }, { status: 500 });
	}
}
