const User = require('../models/User');

/**
 * Get all users
 * GET /api/admin/users
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = User.getAll();
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Delete user
 * DELETE /api/admin/users/:id
 */
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Prevent deleting self
        if (parseInt(userId) === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own admin account'
            });
        }

        const user = User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        User.delete(userId);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
