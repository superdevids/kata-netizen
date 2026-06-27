import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

/** Ensure data directory (and subdirectories) exists */
function ensureDir(sub?: string): void {
	const dir = sub ? path.join(DATA_DIR, sub) : DATA_DIR;
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

/** Get path for a given table/file. Supports "table/sub" for subdirectories. */
function fp(table: string): string {
	const parts = table.split("/");
	const file = `${parts.pop()}.json`;
	const sub = parts.length > 0 ? path.join(...parts) : "";
	if (sub) ensureDir(sub);
	else ensureDir();
	return path.join(DATA_DIR, sub, file);
}

/** Read all records from a JSON file */
export function readAll<T>(table: string): T[] {
	ensureDir();
	try {
		const raw = fs.readFileSync(fp(table), "utf-8");
		return JSON.parse(raw);
	} catch {
		return [];
	}
}

/** Write all records to a JSON file */
export function writeAll<T>(table: string, data: T[]): void {
	ensureDir();
	fs.writeFileSync(fp(table), JSON.stringify(data, null, 2), "utf-8");
}

/** Append one record */
export function append<T>(table: string, item: T): T[] {
	const data = readAll<T>(table);
	data.push(item);
	writeAll(table, data);
	return data;
}

/**
 * Append one record with max size limit.
 * If data exceeds maxEntries, OLDEST entries are trimmed (FIFO).
 * Use this for high-volume logs like visitor-log.
 */
export function appendWithLimit<T>(table: string, item: T, maxEntries = 10000): T[] {
	const data = readAll<T>(table);
	data.push(item);
	// Trim oldest if exceeds limit
	if (data.length > maxEntries) {
		const trimmed = data.slice(data.length - maxEntries);
		writeAll(table, trimmed);
		return trimmed;
	}
	writeAll(table, data);
	return data;
}

/** Find first record matching predicate */
export function findOne<T>(table: string, predicate: (item: T) => boolean): T | undefined {
	return readAll<T>(table).find(predicate);
}

/** Find all records matching predicate */
export function findMany<T>(table: string, predicate?: (item: T) => boolean): T[] {
	const all = readAll<T>(table);
	return predicate ? all.filter(predicate) : all;
}

/** Update records matching predicate */
export function updateMany<T>(table: string, predicate: (item: T) => boolean, updater: (item: T) => T): number {
	const data = readAll<T>(table);
	let count = 0;
	for (let i = 0; i < data.length; i++) {
		if (predicate(data[i])) {
			data[i] = updater(data[i]);
			count++;
		}
	}
	if (count > 0) writeAll(table, data);
	return count;
}

/** Delete records matching predicate */
export function deleteMany<T>(table: string, predicate: (item: T) => boolean): number {
	const data = readAll<T>(table);
	const before = data.length;
	const filtered = data.filter((item) => !predicate(item));
	const count = before - filtered.length;
	if (count > 0) writeAll(table, filtered);
	return count;
}
