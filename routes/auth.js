const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { signUpBodyValidation ,signInBodyValidation} = require('../utils/validationSchema');
const generateTokens = require('../utils/generateTokens');
const {auth, authorize} = require('../middlewares/auth');


// signup
router.post("/signup", async (req, res) => {
    try {
        const { error } = signUpBodyValidation(req.body);
        if (error)
            return res
                .status(400)
                .json({ error: true, message: error.details[0].message });

        const user = await User.findOne({ userName: req.body.userName });

        if (user)
            return res
                .status(400)
                .json({ error: true, message: "User already exists" });

        // Get emails from env file
        const isAdmin = req.body.email === process.env.ADMIN_EMAIL ? true : false;
        const isSuperAdmin = req.body.email === process.env.SUPER_ADMIN_EMAIL ? true : false;
        
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // log current user roles
        // console.log("isAdmin: ", isAdmin);
        // console.log("isSuperAdmin: ", isSuperAdmin);

        // Assign role and permissions then save user
        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword,
            roles: isSuperAdmin ? "super_admin" : isAdmin ? "admin" : "user",
            permissions: isSuperAdmin ? ["create", "read", "update", "delete"] : isAdmin ? ["create", "read", "update"] : ["read"]
        });


        await newUser.save();
        
        return res
            .status(201)
            .json({ error: false, message: "User created successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
})



// signin
router.post("/signin", async (req, res) => {
    try {
        const { error } = signInBodyValidation(req.body);
        if (error)
            return res
                .status(500)
                .json({ error: true, message: error.details[0].message });
        const user = await User.findOne({ userName: req.body.userName });
        if (!user)
            return res
                .status(400)
                .json({ error: true, message: "User does not exist" });
        const isValidPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isValidPassword)
            return res
                .status(400)
                .json({ error: true, message: "Invalid password" });
        const { accessToken, refreshToken } = await generateTokens(user);
        return res
            .status(200)
            .json({ error: false, message: "User signed in successfully", accessToken, refreshToken });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}
);

// uptime
router.get("/ping", async (req, res) => {
    res.status(200).json({ error: false, message: "Server is up" });
});
    

module.exports = router;