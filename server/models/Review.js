/**
 * Review Model - Stores student testimonials
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    course: {
        type: String,
        required: [true, 'Course is required'],
        enum: [
            'Web Development',
            'Digital Marketing',
            'WordPress & SEO',
            'E-commerce',
            'Freelancing'
        ]
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    review: {
        type: String,
        required: [true, 'Review text is required'],
        trim: true,
        minlength: [1, 'Review must be at least 1 character'],
        maxlength: [1000, 'Review cannot exceed 1000 characters']
    },
    isApproved: {
        type: Boolean,
        default: false // Admin can approve before showing
    }
}, {
    timestamps: true
});

// Index for faster queries
reviewSchema.index({ course: 1, rating: -1 });

module.exports = mongoose.model('Review', reviewSchema);