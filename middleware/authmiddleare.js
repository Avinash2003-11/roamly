const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-dev-secret'; 
const COOKIE_NAME = 'token'; 


const createTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,             
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',         
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token; 
};



const verifyTokenFromCookie = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // ✅ Add decoded payload to request
        next();
    } catch (err) {
        console.error("❌ Token verification failed:", err);
        return res.status(401).json({ message: "Invalid token." });
    }
};




const clearTokenCookie = (res) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict'
    });
};

module.exports = {
    createTokenAndSetCookie,
    verifyTokenFromCookie,
    clearTokenCookie
};
