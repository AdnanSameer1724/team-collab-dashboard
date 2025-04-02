const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
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
        console.log('Decoded token:', decoded);

        const currentUser = await User.findById(decoded.id).select('+passwordChangedAt');
        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: 'The user belonging to this token no longer exists',
                code: 'USER_NOT_FOUND'
            });
        }

        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                success: false,
                message: 'User recently changed password. Please log in again',
                code: 'PASSWORD_CHANGED'
            });
        }

        req.user = currentUser;
        console.log(`Authenticated user: ${currentUser._id}`);
        next();
    }
    catch(error){
        console.error('Authentication error:', error.message);

        let errorMessage = 'Invalid token';
        let errorCode = 'INVALID_TOKEN';

        if (error.name === 'TokenExpiredError') {
            errorMessage = 'Token expired';
            errorCode = 'TOKEN_EXPIRED';
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = 'Malformed token';
            errorCode = 'MALFORMED_TOKEN';
        }

        return res.status(401).json({ 
            success: false, 
            error: errorMessage,
            code: errorCode
        });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.warn(`Unauthorized role access attempt: ${req.user.role} tried accessing ${roles}`);
            return res.status(403).json({ 
                success: false, 
                error: `Role ${req.user.role} is not authorized to access this route`,
                requiredRoles: roles
            });
        }
        next();
    };
};

exports.checkOwnership = (model) => {
    return asyncHandler(async (req, res, next) => {
        const resource = await model.findById(req.params.id);
        
        if (!resource) {
            console.warn(`Resource not found: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Resource not found',
                code: 'RESOURCE_NOT_FOUND'
            });
        }

        if (req.user.role === 'admin') {
            console.log(`Admin ${req.user._id} bypassing ownership check`);
            return next();
        }
        
        if (resource.user.toString() !== req.user.id.toString()) {
            console.warn(`Ownership violation: User ${req.user.id} tried accessing resource ${resource._id}`);
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this resource',
                code: 'OWNERSHIP_VIOLATION'
            });
        }
        
        next();
    });
};