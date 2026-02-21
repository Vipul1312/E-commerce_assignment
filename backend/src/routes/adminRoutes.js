const express = require('express');
const router = express.Router();
const { getDashboard, getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
