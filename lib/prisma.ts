import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as {
	prisma?: PrismaClient;
};

console.log("✓ Database: Connecting");

const adapter = new PrismaMariaDb({
	host: process.env["DATABASE_HOST"],
	port: Number(process.env["DATABASE_PORT"] ?? 3306),
	user: process.env["DATABASE_USER"],
	password: process.env["DATABASE_PASSWORD"],
	database: process.env["DATABASE_NAME"],
	connectionLimit: 20,
	connectTimeout: 10000,
	acquireTimeout: 5000,
	allowPublicKeyRetrieval: true,
	ssl: false,
});

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter,
		log: process.env.NODE_ENV === "production" ? [] : ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}