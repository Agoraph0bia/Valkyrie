import SQLite3, { Database } from 'better-sqlite3';

let database: Database;

export async function dbOpen() {
	database = new SQLite3('valkyrie.db');
	database.pragma('journal_mode = WAL');
	return database;
}
