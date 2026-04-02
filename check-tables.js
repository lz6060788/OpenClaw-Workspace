const Database = require('better-sqlite3');

const db = new Database('/root/.openclaw/workspace/OpenClaw-Workspace/openclaw.db');

const tables = db.prepare('SELECT name FROM sqlite_master WHERE type="table" ORDER BY name').all();
console.log('Tables in openclaw.db:', tables);

const settings = db.prepare('SELECT COUNT(*) as count FROM settings').all();
console.log('Settings count:', settings);

db.close();
