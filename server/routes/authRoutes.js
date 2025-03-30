const express = require('express');
const { validateRegister, validateLogin } = require('../middleware/validators');
const { register, login, getMe } = require('../controllers/authController');
const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

module.exports = router;