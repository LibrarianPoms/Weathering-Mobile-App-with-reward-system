const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// All admin routes require auth + admin check
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
