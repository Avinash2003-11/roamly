const mongoose = require('mongoose');
require('dotenv').config(); // Make sure this loads your .env file

const uri = process.env.MONGO_URI; // Get URI from .env

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ roamly database connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
