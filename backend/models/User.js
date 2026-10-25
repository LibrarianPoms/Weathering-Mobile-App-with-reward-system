const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    /**
     * Create a new user
     * @param {string} username 
     * @param {string} email 
     * @param {string} password 
     * @returns {Object} Created user (without password)
     */
    static create(username, email, password, isAdmin = 0) {
        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        db.run(
            "INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)",
            [username, email, hashedPassword, isAdmin]
        );

        // Fetch back to get the ID correctly
        return this.findByEmail(email);
    }

    /**
     * Find user by email
     * @param {string} email 
     * @returns {Object|undefined} User object or undefined
     */
    static findByEmail(email) {
        return db.get('SELECT * FROM users WHERE email = ?', [email]);
    }

    /**
     * Find user by ID
     * @param {number} id 
     * @returns {Object|undefined} User object or undefined
     */
    /**
     * Find user by ID
     * @param {number} id 
     * @returns {Object|undefined} User object or undefined
     */
    static findById(id) {
        return db.get('SELECT * FROM users WHERE id = ?', [id]);
    }

    /**
     * Find user by username
     * @param {string} username 
     * @returns {Object|undefined} User object or undefined
     */
    static findByUsername(username) {
        return db.get('SELECT * FROM users WHERE username = ?', [username]);
    }

    /**
     * Verify password
     * @param {string} plainPassword 
     * @param {string} hashedPassword 
     * @returns {boolean}
     */
    static verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }

    /**
     * Get all users (for admin purposes)
     * @returns {Array} Array of users
     */
    static getAll() {
        return db.all('SELECT id, username, email, is_admin, coins, searches_count, created_at FROM users');
    }

    /**
     * Delete user by ID
     * @param {number} id
     */
    static delete(id) {
        return db.run('DELETE FROM users WHERE id = ?', [id]);
    }

    /**
     * Increment search count and check for rewards
     * @param {number} userId 
     * @returns {Object} { coinsEarned: number, totalCoins: number }
     */
    static incrementSearchCount(userId) {
        // Ensure count increments even if null
        db.run('UPDATE users SET searches_count = COALESCE(searches_count, 0) + 1 WHERE id = ?', [userId]);
        const user = db.get('SELECT searches_count, coins FROM users WHERE id = ?', [userId]);

        console.log(`[UserModel] User ${userId} search count: ${user?.searches_count}, coins: ${user?.coins}`);

        // Reward: 5 coins every 3 searches
        if (user.searches_count > 0 && user.searches_count % 3 === 0) {
            console.log(`[UserModel] Rewarding user ${userId}`);
            db.run('UPDATE users SET coins = coins + 5 WHERE id = ?', [userId]);
            return { coinsEarned: 5, totalCoins: user.coins + 5 };
        }
        return { coinsEarned: 0, totalCoins: user.coins };
    }

    /**
     * Add item to user inventory
     */
    static addItem(userId, itemId, itemType) {
        return db.run(
            'INSERT INTO user_items (user_id, item_id, item_type) VALUES (?, ?, ?)',
            [userId, itemId, itemType]
        );
    }

    /**
     * Check if user owns item
     */
    static hasItem(userId, itemId) {
        const result = db.get('SELECT id FROM user_items WHERE user_id = ? AND item_id = ?', [userId, itemId]);
        return !!result;
    }

    /**
     * Deduct coins from user
     */
    static deductCoins(userId, amount) {
        return db.run('UPDATE users SET coins = coins - ? WHERE id = ?', [amount, userId]);
    }

    /**
     * Equip item (theme or font)
     */
    static equipItem(userId, type, value) {
        if (type === 'theme') {
            return db.run('UPDATE users SET equipped_theme = ? WHERE id = ?', [value, userId]);
        } else if (type === 'font') {
            return db.run('UPDATE users SET equipped_font = ? WHERE id = ?', [value, userId]);
        }
    }

    /**
     * Get user inventory
     */
    static getInventory(userId) {
        return db.all('SELECT item_id, item_type FROM user_items WHERE user_id = ?', [userId]);
    }

    /**
     * Get Leaderboard
     */
    static getLeaderboard(limit = 10) {
        return db.all('SELECT id, username, coins FROM users ORDER BY coins DESC LIMIT ?', [limit]);
    }
}

module.exports = User;
