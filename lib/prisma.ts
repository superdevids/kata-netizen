import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as {
	prisma?: PrismaClient;
};

// ============================================
// Database Connection Configuration
// Supports two modes:
// 1. Regular SSL connection (ssl-mode=REQUIRED)
// 2. SSL with CA certificate verification (ssl-mode=VERIFY_CA)
// ============================================

const useSslCa = process.env["DATABASE_USE_SSL_CA"] === "true";
const sslCaContent = process.env["DATABASE_SSL_CA_CONTENT"];

// SSL Configuration
let sslConfig: any = undefined;

if (useSslCa && sslCaContent) {
	// Mode 2: SSL with CA certificate verification
	try {
		sslConfig = {
			ssl: {
				ca: sslCaContent,
				rejectUnauthorized: true,
			},
		};
		console.log("✓ Database: Using SSL with CA certificate (from env)");
	} catch (error) {
		console.error("✗ Database: Failed to load CA certificate from:", sslCaContent);
		console.error("  Error:", error);
		console.log("  Falling back to regular SSL connection...");
		sslConfig = undefined;
	}
} else {
	// Mode 1: Regular SSL connection (no CA cert)
	console.log("✓ Database: Using standard SSL connection (ssl-mode=REQUIRED)");
}

// Optimized connection pool for high traffic (100-5000 users/hour)
const adapter = new PrismaMariaDb({
	host: process.env["DATABASE_HOST"],
	port: Number(process.env["DATABASE_PORT"] ?? 3306),
	user: process.env["DATABASE_USER"],
	password: process.env["DATABASE_PASSWORD"],
	database: process.env["DATABASE_NAME"],
	// SSL configuration (if enabled)
	...(sslConfig && { ssl: sslConfig.ssl }),
	// Connection pool optimization
	connectionLimit: 20, // Increased for concurrent requests
	// Performance settings
	connectTimeout: 10000, // 10s timeout for connection
	acquireTimeout: 5000, // 5s timeout for acquiring from pool
});

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter,
		log: process.env.NODE_ENV === "production" ? [] : ["error"], // Disable logging in production
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
