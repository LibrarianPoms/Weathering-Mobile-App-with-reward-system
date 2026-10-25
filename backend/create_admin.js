const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        const dbPath = path.join(__dirname, 'data', 'weathering_waves.db');
        const filebuffer = fs.readFileSync(dbPath);

        const SQL = await initSqlJs();
        const db = new SQL.Database(filebuffer);

        // Hydrostatically hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync('password123', salt);

        // Check if user exists
        const existing = db.exec("SELECT * FROM users WHERE email='admin@test.com'");

        if (existing.length > 0) {
            console.log('Admin user already exists. Updating password and permissions...');
            db.run("UPDATE users SET password = ?, is_admin = 1 WHERE email = 'admin@test.com'", [hashedPassword]);
        } else {
            console.log('Creating new admin user...');
            db.run(
                "INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)",
                ['admin', 'admin@test.com', hashedPassword, 1]
            );
        }

        // Save back to file
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);

        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@test.com');
        console.log('Password: password123');

    } catch (error) {
        console.error('Error creating admin:', error);
    }
}

createAdmin();
