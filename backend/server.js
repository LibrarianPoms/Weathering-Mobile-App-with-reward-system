require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for development (React Native)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shop', shopRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Weathering Waves API is running!',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Weathering Waves API',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                profile: 'GET /api/auth/me (requires token)'
            },
            weather: {
                current: 'GET /api/weather/current?city=London (requires token)',
                forecast: 'GET /api/weather/forecast?city=London (requires token)'
            }
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server after database initialization
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Initialize database first
        await initDatabase();

        app.listen(PORT, () => {
            console.log('=========================================');
            console.log(`🌤️  Weathering Waves API Server`);
            console.log(`🚀 Running on http://localhost:${PORT}`);
            console.log(`📁 Database: SQLite (sql.js)`);
            console.log('=========================================');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
