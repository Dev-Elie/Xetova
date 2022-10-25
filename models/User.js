const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        enum: ["super_admin","admin", "user"],
        default: ["user"],
    },
    // add permissions
    permissions: {
        type: [String],
        enum: ["create", "read", "update", "delete"],
        default: ["read"],
    },
    isActive: {
        type: Boolean,
        default: true
    }
}  , {timestamps: true});

const User = mongoose.model("User", UserSchema);
module.exports = User;