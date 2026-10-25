/**
 * Admin middleware
 * Verifies if the authenticated user is an admin
 */
const adminMiddleware = (req, res, next) => {
    // req.user is populated by authMiddleware
    // We need to fetch the full user from DB to be sure (token payloads might be stale)
    const User = require('../models/User');
    const user = User.findById(req.user.id);

    if (!user || user.is_admin !== 1) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }

    next();
};

module.exports = adminMiddleware;
