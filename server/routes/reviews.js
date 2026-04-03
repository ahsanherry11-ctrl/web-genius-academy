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
        // Flexible query: Fetch reviews where isApproved is true OR field doesn't exist
        const reviews = await Review.find({
            $or: [
                { isApproved: true },
                { isApproved: { $exists: false } }
            ]
        })
        .sort({ createdAt: -1 })
        .limit(20);
        
        console.log(`✅ Fetched ${reviews.length} reviews`);
        res.json(reviews);
    } catch (error) {
        console.error('❌ Error fetching reviews:', error);
        res.status(500).json({ 
            message: 'Server error while fetching reviews',
            error: error.message 
        });
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
        
        console.log(`✅ New review submitted by ${name}`);
        
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
        console.error('❌ Error submitting review:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        
        res.status(500).json({ 
            message: 'Server error while submitting review',
            error: error.message 
        });
    }
});

module.exports = router;