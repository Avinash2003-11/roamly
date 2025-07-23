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
    origin: 'http://localhost:3000', // Or your frontend URL
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
