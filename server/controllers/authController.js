const User = require("../models/User");
const User = require("../models/User");
const asyncHandler = require('express-async-handler');

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error('Plese provide all fields');
    }

    const userExists = await User.findOne({ email });
    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    const User = await User.create({ name, email, password, role });
    const token = User.generateToken();

    res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, role: user.role }
    });
});


exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if(!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401);
        throw new Error('Invalid credentials!');
    }

    const token = user.generateToken();
    res.json({ success: true, token });
});