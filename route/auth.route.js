const express = require('express');
const myRouter = express.Router()

const { signin, signup } = require("../controller/auth.controller");

myRouter.post("/signin", signin);
myRouter.post("/signup", signup);

module.exports = myRouter