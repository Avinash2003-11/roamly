const express = require('express');
const { register, login, getProfile, updateProfile, deleteProfile } = require('../controllers/usercontroller');
const { verifyTokenFromCookie } = require('../middleware/authmiddleare');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyTokenFromCookie, getProfile);
router.put('/update', verifyTokenFromCookie, updateProfile);
router.delete('/delete', verifyTokenFromCookie, deleteProfile);

module.exports = router;
