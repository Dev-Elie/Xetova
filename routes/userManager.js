const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { signUpBodyValidation ,signInBodyValidation} = require('../utils/validationSchema');
const generateTokens = require('../utils/generateTokens');
const {auth, authorize} = require('../middlewares/auth');

// Manage users: super admin can read, update, delete users

// Read all users
router.get("/", auth, authorize(["read"], ["super_admin"]), async (req, res) => {
    try {
        // exclude password
        const users = await User.find({}, { password: 0 });
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Read a user
router.get("/:id", auth, authorize(["read"], ["super_admin"]), async (req, res) => {
    try {
        // exclude password
        const user = await User.findById(req.params.id, { password: 0 });
        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Update a user
router.put("/:id", auth, authorize(["update"], ["super_admin"]), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user)
            return res
                .status(400)
                .json({ error: true, message: "User does not exist" });
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ error: false, message: "User updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Delete a user
router.delete("/:id", auth, authorize(["delete"], ["super_admin"]), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user)

            return res
                .status(400)
                .json({ error: true, message: "User does not exist" });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ error: false, message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});





module.exports = router;