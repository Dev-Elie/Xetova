const jwt = require('jsonwebtoken');
const UserToken = require('../models/UserToken');


const generateTokens = async (user) => {
    try {
        
        const accessToken = jwt.sign({ userId: user._id }, 
            process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1h' });

        const refreshToken = jwt.sign({ userId: user._id }, 
            process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });

        const userToken = await UserToken.findOne({ userId: user._id });
        if (userToken) await userToken.remove();

        // save new token
        await UserToken.create({
            userId: user._id,
            token: refreshToken
        });
        return Promise.resolve({ accessToken, refreshToken });
        
    } catch (error) {
        return Promise.reject(error);
    }
}

module.exports = generateTokens;