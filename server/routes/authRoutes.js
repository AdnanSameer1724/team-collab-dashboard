const express = require('express');
const router = express.Router();
const { validateRegister, validateLogin } = require('../middleware/validators');
const { protect } = require('../middleware/authMiddleware')
const { register, login, getMe } = require('../controllers/authController');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

module.exports = router;