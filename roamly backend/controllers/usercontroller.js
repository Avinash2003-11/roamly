const User = require('../models/userschema');
const { createTokenAndSetCookie, verifyTokenFromCookie } = require('../middleware/authmiddleare');
const bcrypt = require('bcrypt');

// ✅ Create (Register User)
const register = async (req, res) => {
    try {
        const { email, name, password, confirmpassword, preferences, hometown } = req.body;

        if (!email || !name || !password || !confirmpassword || !preferences || !hometown) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        const exuser = await User.findOne({ email });
        if (exuser) {
            return res.status(409).json({ message: "User already exists." });
        }

        const preferencesArray = Array.isArray(preferences)
            ? preferences
            : typeof preferences === 'string'
                ? preferences.split(',').map(pref => pref.trim())
                : [];

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            name,
            password: hashedPassword,
            preferences: preferencesArray,
            hometown
        });

        await newUser.save();

        createTokenAndSetCookie(res, newUser._id);

        return res.status(201).json({
            message: "Registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                preferences: newUser.preferences,
                hometown: newUser.hometown
            }
        });
    } catch (err) {
        console.error("❌ Registration error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};

// ✅ Read (Get Profile)
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // set by verifyTokenFromCookie
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.error("❌ Profile fetch error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};

// ✅ Update (Update Profile)
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, preferences, hometown } = req.body;

        const updatedData = {
            ...(name && { name }),
            ...(email && { email }),
            ...(preferences && { preferences: Array.isArray(preferences) ? preferences : preferences.split(',').map(p => p.trim()) }),
            ...(hometown && { hometown })
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
        console.error("❌ Profile update error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};

// ✅ Delete (Delete Profile)
const deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        await User.findByIdAndDelete(userId);
        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error("❌ Delete account error:", err);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};




const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        createTokenAndSetCookie(res, user._id);

        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences,
                hometown: user.hometown
            }
        });
    } catch (error) {
        console.error("❌ Login error:", error);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
};

module.exports = {
    register,
    getProfile,
    updateProfile,
    deleteProfile,
    login
};
