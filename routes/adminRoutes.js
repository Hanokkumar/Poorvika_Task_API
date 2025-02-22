const express = require('express');
const { authenticateJWT, authorizeRole } = require('../middleware/authMiddleware');
const User = require('../models/User')

const router = express.Router();


router.get('/', authenticateJWT, authorizeRole('Admin'), (req, res) => {
    res.json({ success: true, message: 'Welcome Admin!', admin: req.user });
});

// router.get('/Admin', authenticateJWT, authorizeRole('Admin'), async (req, res) => {
//     try {
//         res.json({ success: true, message: 'Admin Route Accessed Successfully!' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//     }
// });

module.exports = router;
