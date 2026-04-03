/**
 * Auth Routes
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // ✅ ADD THIS
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    console.log('📝 Register request received:', { name, email, password: '***' });
    
    // Validation
    if (!name || !email || !password) {
        console.log('❌ Missing fields');
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            console.log('❌ User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        
        await user.save();
        
        console.log('✅ User created:', email);
        
        // Create token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '30d' }
        );
        
        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('❌ Register error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    console.log('📝 Login request received:', { email });
    
    // Validation
    if (!email || !password) {
        console.log('❌ Missing fields');
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('❌ User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            console.log('❌ Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        console.log('✅ Login successful:', email);
        
        // Create token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '30d' }
        );
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;