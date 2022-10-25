const jwt = require('jsonwebtoken');
const User = require('../models/User');


const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

// A middleware function that checks if the user has the required permissions and roles to perform the action uses the auth middleware to check if the user is logged in
// Use auth to do the authentication and authorization

const authorize = (permissions, roles) => {
    return async (req, res, next) => {
        const token = req.header('x-auth-token');
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ msg: 'No user found' });
        }
        const userPermissions = user.permissions;
        const userRoles = user.roles;
        const hasPermission = permissions.every((permission) =>
            userPermissions.includes(permission)
        );
        const hasRole = roles.every((role) => userRoles.includes(role));
        if (!hasPermission || !hasRole) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        next();
    }
}

module.exports = {auth, authorize};