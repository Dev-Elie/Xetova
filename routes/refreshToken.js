const express = require('express');
const router = express.Router();
const UserToken = require('../models/UserToken');
const jwt = require('jsonwebtoken');
const verifyRefreshToken = require('../utils/verifyRefreshToken');
const {refreshTokenBodyValidation} = require('../utils/validationSchema');


// get new access token

router.post("/", async (req, res) => {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error)
        return res
            .status(400)
            .json({ error: true, message: error.details[0].message });

    verifyRefreshToken(req.body.refreshToken)
        .then(({ tokenDetails }) => {
            const accessToken = jwt.sign({ userId: tokenDetails.userId },
                process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1h' });
            return res
                .status(200)
                .json({ error: false, accessToken, message: "Access token generated successfully" });

        })
        .catch((err) => res.status(400).json({ error: true, message: err.message }));

})

// delete all refresh tokens
router.delete("/", async (req, res) => {
    try {
        const { error } = refreshTokenBodyValidation(req.body);
        if (error)
            return res
                .status(400)
                .json({ error: true, message: error.details[0].message });
        // Search for refresh token in database, if found delete it
        const userToken = await UserToken.findOne({ token: req.body.refreshToken });

        if (!userToken)
            return res
                .status(200)
                .json({ error: false, message: "Token expired successfully" });

        await userToken.remove();
        return res
            .status(200)
            .json({ error: false, message: "Token expired successfully" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal server error" });
    }
});

module.exports = router;