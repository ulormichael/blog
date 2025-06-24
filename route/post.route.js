const express = require("express");
const verifyToken = require("../middlewares/verify_token")
const myRouter = express.Router()
const multer = require("multer");
const path = require("path");

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controller/post.controller");

 const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, './uploads/')
   },
   filename: function (req, file, cb) {
     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
     cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname))
   }
 })
 
 const upload = multer({ storage: storage })

myRouter.post("/create-post", verifyToken,upload.single("image"), createPost);
myRouter.get("/posts", getPosts);
myRouter.get("/post/:id", getPostById);
myRouter.patch("/post/:id", updatePost);
myRouter.delete("/post/:id", deletePost);

module.exports = myRouter;
// This code defines the routes for managing blog posts in an Express application.