const express = require("express");
const authRoutes = require("./routes/auth");
const refreshTokenRoutes = require("./routes/refreshToken");
const userManager = require("./routes/userManager");
const dbConnect = require("./dbConnect");


const app = express();
require('dotenv/config')
dbConnect();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/refreshToken", refreshTokenRoutes);
app.use("/api/manageUsers", userManager);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;
