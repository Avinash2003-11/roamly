const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Load .env variables

const connectDB = require('./config/db'); // MongoDB connection
const userRoutes = require('./routes/userroutes'); // User auth routes

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB Atlas
connectDB();

// ✅ Middlewares
app.use(express.json()); // To parse JSON requests
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // OR use regex to allow both
 // Or your frontend URL
    credentials: true, // Allow cookies
}));
app.use(cookieParser()); // To parse cookies

// ✅ Routes
app.get('/', (req, res) => {
    res.send('🚀 Hello from Express + MongoDB Atlas!');
});
app.use('/api/auth', userRoutes);

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🌐 Server running on http://localhost:${PORT}`);
});
