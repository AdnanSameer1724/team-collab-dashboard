const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

exports.protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if(!token){
        return res.status(401).json({ success: false, error: 'Not Authorized' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: 'The user belonging to this token no longer exists'
            });
        }

        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                success: false,
                message: 'User recently changed password. Please log in again'
            });
        }

        req.user = currentUser;
        next();
    }
    catch(error){
        return res.status(401).json({ success: false, error: 'Invalid Token' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: 'Unauthorized Access'});
        }
        next();
    };
};

exports.checkOwnership = (model) => {
    return asyncHandler(async (req, res, next) => {
        const resource = await model.findById(req.params.id);
        
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        if (req.user.role === 'admin') return next();
        
        if (resource.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this resource'
            });
        }
        
        next();
    });
};