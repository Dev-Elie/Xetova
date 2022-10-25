const mongoose = require("mongoose");

const dbConnect = ()=>{
    mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

    mongoose.connection.on("connected", ()=>{
        console.log("Connected to MongoDB");
    }
    );
    mongoose.connection.on("error", (err)=>{
        console.log(err);
    }
    );
    mongoose.connection.on("disconnected", ()=>{
        console.log("Disconnected from MongoDB");
    }
    );
}

module.exports = dbConnect;