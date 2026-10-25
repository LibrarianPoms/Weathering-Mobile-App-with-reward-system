const User = require('../models/User');

const SHOP_ITEMS = {
    themes: [
        {
            id: 'theme_default', name: 'Royal Purple', type: 'theme', price: 0,
            value: { start: '#667eea', end: '#764ba2' }
        },
        {
            id: 'theme_ocean', name: 'Ocean Depth', type: 'theme', price: 20,
            value: { start: '#2E3192', end: '#1BFFFF' }
        },
        {
            id: 'theme_sunset', name: 'Sunset Vibes', type: 'theme', price: 30,
            value: { start: '#FF512F', end: '#DD2476' }
        },
        {
            id: 'theme_forest', name: 'Mystic Forest', type: 'theme', price: 40,
            value: { start: '#11998e', end: '#38ef7d' }
        },
        {
            id: 'theme_midnight', name: 'Midnight Gold', type: 'theme', price: 50,
            value: { start: '#0f0c29', end: '#302b63' }
        },
    ],
    fonts: [
        { id: 'font_default', name: 'System Default', type: 'font', price: 0, value: 'System' },
        { id: 'font_serif', name: 'Classic Serif', type: 'font', price: 15, value: 'serif' },
        { id: 'font_mono', name: 'Coder Mono', type: 'font', price: 15, value: 'monospace' },
    ]
};

exports.getShopItems = (req, res) => {
    try {
        const userId = req.user.id;
        const user = User.findById(userId);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found. Please login again.' });
        }

        const ownedItems = User.getInventory(userId);

        // Mark owned items
        const ownedIds = new Set(ownedItems.map(i => i.item_id));
        // Always own defaults
        ownedIds.add('theme_default');
        ownedIds.add('font_default');

        const catalog = {
            themes: SHOP_ITEMS.themes.map(item => ({ ...item, owned: ownedIds.has(item.id) })),
            fonts: SHOP_ITEMS.fonts.map(item => ({ ...item, owned: ownedIds.has(item.id) }))
        };

        res.json({
            success: true,
            data: {
                catalog,
                coins: user.coins,
                equipped: {
                    theme: user.equipped_theme,
                    font: user.equipped_font
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.buyItem = (req, res) => {
    try {
        const { itemId, type } = req.body;
        const userId = req.user.id;
        const user = User.findById(userId);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Find item
        const category = type === 'theme' ? 'themes' : 'fonts';
        const item = SHOP_ITEMS[category].find(i => i.id === itemId);

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        // Check ownership
        if (User.hasItem(userId, itemId) || itemId === 'theme_default' || itemId === 'font_default') {
            return res.status(400).json({ success: false, message: 'You already own this item' });
        }

        // Check coins
        if (user.coins < item.price) {
            return res.status(400).json({ success: false, message: 'Insufficient coins' });
        }

        // Transaction
        User.deductCoins(userId, item.price);
        User.addItem(userId, itemId, type);

        res.json({
            success: true,
            message: `Purchased ${item.name}`,
            data: {
                coins: user.coins - item.price,
                itemId
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.equipItem = (req, res) => {
    try {
        const { itemId, type } = req.body;
        const userId = req.user.id;
        const user = User.findById(userId);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Check ownership (defaults are always owned)
        if (itemId !== 'theme_default' && itemId !== 'font_default' && !User.hasItem(userId, itemId)) {
            return res.status(403).json({ success: false, message: 'You do not own this item' });
        }

        User.equipItem(userId, type, itemId);

        // Fetch updated user
        const updatedUser = User.findById(userId);

        res.json({
            success: true,
            message: 'Item equipped',
            data: {
                user: updatedUser
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getLeaderboard = (req, res) => {
    try {
        const leaderboard = User.getLeaderboard(10);
        res.json({
            success: true,
            data: leaderboard
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
