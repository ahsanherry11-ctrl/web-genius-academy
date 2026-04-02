/**
 * Reviews API Routes
 * Handles: Get all reviews, Submit new review
 */

const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// @route   GET /api/reviews
// @desc    Get all approved reviews
// @access  Public
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ isApproved: true })
            .sort({ createdAt: -1 })
            .limit(20);
        
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server error while fetching reviews' });
    }
});

// @route   POST /api/reviews
// @desc    Submit a new review
// @access  Public
router.post('/', async (req, res) => {
    const { name, email, course, rating, review } = req.body;
    
    // Validation
    if (!name || !email || !course || !rating || !review) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    try {
        const newReview = new Review({
            name,
            email,
            course,
            rating,
            review,
            isApproved: true // Auto-approve for now (change to false for admin moderation)
        });
        
        await newReview.save();
        
        res.status(201).json({
            message: 'Review submitted successfully',
            review: {
                id: newReview._id,
                name: newReview.name,
                course: newReview.course,
                rating: newReview.rating
            }
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        
        res.status(500).json({ message: 'Server error while submitting review' });
    }
});

module.exports = router;