import Database from 'better-sqlite3';

export default {
	Connect: () => {
		const db = new Database('valkyrie.db');
		db.pragma('journal_mode = WAL');

		return db.name;
	},
};
