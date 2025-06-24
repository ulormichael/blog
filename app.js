const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const authSchema = new mongoose.Schema;
const app = express()
const Auth = require("./model/auth.model");
const post = require("./model/post.model");
const authRouter = require("./route/auth.route");
const postRouter = require("./route/post.route");
dotenv.config();
app.use(express.json());
app.use('/uploads', express.static('uploads'));


const port = 3000;

mongoose.connect(process.env.URL, {
     // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});


app.get("/", (req,res)=>{
    res.send("Hello, World! Welcome to my Blog");
});

// localhost: 3000/users

// const authRouter = require("./route/auth.route");

app.use(authRouter);
app.use(postRouter);

// localhost:3000/users/:id
app.listen(port, ()=> {
    console.log(`listening to port ${port}`)
})