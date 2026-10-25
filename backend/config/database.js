const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

// Database file path
const dbPath = path.join(__dirname, '..', 'data', 'weathering_waves.db');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

let db = null;

/**
 * Initialize the database
 * @returns {Promise<Database>} SQLite database instance
 */
const initDatabase = async () => {
    const SQL = await initSqlJs();

    // Try to load existing database
    try {
        if (fs.existsSync(dbPath)) {
            const fileBuffer = fs.readFileSync(dbPath);
            db = new SQL.Database(fileBuffer);
            console.log('✅ Loaded existing database');
        } else {
            db = new SQL.Database();
            console.log('✅ Created new database');
        }
    } catch (error) {
        console.log('Creating new database...');
        db = new SQL.Database();
    }

    // Create users table if it doesn't exist
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            is_admin INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Check if is_admin column exists
    try {
        db.exec("SELECT is_admin FROM users LIMIT 1");
    } catch (e) {
        console.log('Migrating database: Adding is_admin column...');
        try {
            db.run("ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0");
        } catch (alterError) {
            console.error('Migration failed:', alterError);
        }
    }

    // Check if coins/shop columns exist
    try {
        db.exec("SELECT coins FROM users LIMIT 1");
    } catch (e) {
        console.log('Migrating database: Adding shop columns...');
        try {
            db.run("ALTER TABLE users ADD COLUMN coins INTEGER DEFAULT 0");
            db.run("ALTER TABLE users ADD COLUMN searches_count INTEGER DEFAULT 0");
            db.run("ALTER TABLE users ADD COLUMN equipped_theme TEXT DEFAULT 'default'");
            db.run("ALTER TABLE users ADD COLUMN equipped_font TEXT DEFAULT 'default'");
        } catch (alterError) {
            console.error('Shop Migration failed:', alterError);
        }
    }

    // Create User Items Table
    db.run(`
        CREATE TABLE IF NOT EXISTS user_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            item_id TEXT NOT NULL,
            item_type TEXT NOT NULL,
            purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    // Ensure Admin User Exists
    try {
        const adminCheck = db.exec("SELECT * FROM users WHERE email='admin@test.com'");
        if (!adminCheck || adminCheck.length === 0 || !adminCheck[0].values || adminCheck[0].values.length === 0) {
            console.log('Creating default admin user...');
            const bcrypt = require('bcryptjs');
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync('password123', salt);
            db.run(
                "INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)",
                ['admin', 'admin@test.com', hashedPassword, 1]
            );
            console.log('Admin user created: admin@test.com / password123');
        }
    } catch (err) {
        console.error('Error creating admin user:', err);
    }

    // Save database
    saveDatabase();

    console.log('✅ Database initialized successfully');
    return db;
};

/**
 * Save database to file
 */
const saveDatabase = () => {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
};

/**
 * Get database instance
 * @returns {Database} SQLite database instance
 */
const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return db;
};

/**
 * Run a query with parameters
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Object} Result info
 */
const run = (sql, params = []) => {
    const database = getDb();
    database.run(sql, params);
    saveDatabase();
    return {
        lastInsertRowid: database.exec("SELECT last_insert_rowid()")[0]?.values[0][0] || 0,
        changes: database.getRowsModified()
    };
};

/**
 * Get a single row
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Object|undefined} Row object or undefined
 */
const get = (sql, params = []) => {
    const database = getDb();
    const stmt = database.prepare(sql);
    stmt.bind(params);

    if (stmt.step()) {
        const columns = stmt.getColumnNames();
        const values = stmt.get();
        stmt.free();

        const row = {};
        columns.forEach((col, i) => {
            row[col] = values[i];
        });
        return row;
    }

    stmt.free();
    return undefined;
};

/**
 * Get all rows
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Array} Array of row objects
 */
const all = (sql, params = []) => {
    const database = getDb();
    const stmt = database.prepare(sql);
    stmt.bind(params);

    const rows = [];
    while (stmt.step()) {
        const columns = stmt.getColumnNames();
        const values = stmt.get();

        const row = {};
        columns.forEach((col, i) => {
            row[col] = values[i];
        });
        rows.push(row);
    }

    stmt.free();
    return rows;
};

module.exports = {
    initDatabase,
    getDb,
    saveDatabase,
    run,
    get,
    all
};
