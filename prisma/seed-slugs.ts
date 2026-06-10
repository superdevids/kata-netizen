/**
 * Utility: Generate slugs for existing Isu rows that don't have one.
 * Run via: npx tsx prisma/seed-slugs.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import fs from "fs";
import path from "path";

// SSL Configuration (same as lib/prisma.ts)
const useSslCa = process.env["DATABASE_USE_SSL_CA"] === "true";
const sslCaPath = process.env["DATABASE_SSL_CA_PATH"];

let sslConfig: any = undefined;

if (useSslCa && sslCaPath) {
	try {
		const caFilePath = path.resolve(process.cwd(), sslCaPath);
		const caCert = fs.readFileSync(caFilePath, "utf-8");
		sslConfig = {
			ssl: {
				ca: caCert,
				rejectUnauthorized: true,
			},
		};
	} catch (error) {
		console.error("Failed to load CA certificate, using standard SSL...");
		sslConfig = undefined;
	}
}

const adapter = new PrismaMariaDb({
	host: process.env["DATABASE_HOST"],
	port: Number(process.env["DATABASE_PORT"] ?? 3306),
	user: process.env["DATABASE_USER"],
	password: process.env["DATABASE_PASSWORD"],
	database: process.env["DATABASE_NAME"],
	...(sslConfig && { ssl: sslConfig.ssl }),
	connectionLimit: 10,
});

const prisma = new PrismaClient({ adapter, log: ["error"] });

function generateSlug(judul: string): string {
	return judul
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.slice(0, 80);
}

async function main() {
	const isuList = await prisma.isu.findMany({
		where: { slug: null },
		select: { id: true, judul: true },
	});

	if (isuList.length === 0) {
		return;
	}

	for (const isu of isuList) {
		let slug = generateSlug(isu.judul);

		// Ensure uniqueness
		const existing = await prisma.isu.findFirst({ where: { slug } });
		if (existing) {
			slug = `${slug}-${isu.id.slice(0, 8)}`;
		}

		await prisma.isu.update({
			where: { id: isu.id },
			data: { slug },
		});
	}

	// All slugs updated successfully
}

main()
	.catch(() => {
		// Silently handle errors
	})
	.finally(() => prisma.$disconnect());
