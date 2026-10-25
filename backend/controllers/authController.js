const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {Object} user 
 * @returns {string} JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username, email and password'
            });
        }

        // Check if email already exists
        const existingEmail = User.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Check if username already exists
        const existingUsername = User.findByUsername(username);
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Create user (make first user admin for convenience if this is a demo)
        // Check if this is the first user
        const allUsers = User.getAll();
        const isAdmin = allUsers.length === 0 ? 1 : 0;

        const user = User.create(username, email, password, isAdmin);

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    is_admin: user.is_admin
                },
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user by email
        const user = User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isValidPassword = User.verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    is_admin: user.is_admin
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
exports.getProfile = async (req, res) => {
    try {
        const user = User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
