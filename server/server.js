/**
 * Web Genius Academy - Main Server
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');

dotenv.config();
connectDB();

const app = express();

// ✅ FIXED CORS (single use)
const cors = require('cors');
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, '../client')));

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});