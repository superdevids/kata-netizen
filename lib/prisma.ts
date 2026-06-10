import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as {
	prisma?: PrismaClient;
};

// Optimized connection pool for high traffic (100-5000 users/hour)
const adapter = new PrismaMariaDb({
	host: process.env["DATABASE_HOST"],
	port: Number(process.env["DATABASE_PORT"] ?? 3306),
	user: process.env["DATABASE_USER"],
	password: process.env["DATABASE_PASSWORD"],
	database: process.env["DATABASE_NAME"],
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
