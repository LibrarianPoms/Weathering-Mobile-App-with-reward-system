const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const auth = require('../middleware/auth');

router.get('/items', auth, shopController.getShopItems);
router.post('/buy', auth, shopController.buyItem);
router.post('/equip', auth, shopController.equipItem);
router.get('/leaderboard', auth, shopController.getLeaderboard);

module.exports = router;
