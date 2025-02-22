const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const validRoles = ['Admin', 'User'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Choose Admin or User.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, role });

        res.status(201).json({ message: 'User created successfully', user: { username: user.username, role: user.role } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.put('/update', async (req, res) => {
    try {
        const { username, password, newUsername, newPassword, newRole } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        // Update user fields
        if (newUsername) user.username = newUsername;
        if (newPassword) user.password = await bcrypt.hash(newPassword, 10);
        if (newRole) user.role = newRole;

        await user.save();
        res.json({ success: true, message: 'User updated successfully', user });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;