// const express = require("express");
const Post = require("../model/post.model"); // Assuming you have a model defined in model/post.js


const createPost = async (req, res) => {
    console.log(req)

  try {
    const { title, content, tags, image, status } = req.body;

 const slug = req.body.title
    .split(' ').join('-').toLowerCase()
    .replace(/[^a-z0-9-]/g, '');

    const author_id = req.user.id;
    const author_name = req.user.name;
    // Validate input
    if (!title || !slug || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new post
    const newPost = new Post({
      title,
      slug: slug, // Generate slug from title
      content,
      author_id,
      author_name,
      tags,
      image: req.file? req.file.path : 'uploads/avatar.png', // Default image if not provided
      status: status || "draft", // Default to 'draft' if not provided
    });

    // Save the post to the database
    await newPost.save();
    res.status(200).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find(); // Fetch all posts from the database
    res.status(200).json(posts); // Return the posts as JSON
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.id; // Get the post ID from the request parameters
    const post = await Post.findById(postId); // Fetch the post by ID

    if (!post) {
      return res.status(404).json({ error: "Post not found" }); // If post not found, return 404
    }

    res.status(200).json(post); // Return the post as JSON
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
    try {
    const postId = req.params.id; // Get the post ID from the request parameters
    const updatedData = req.body; // Get the updated data from the request body

    const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against the schema
    });

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" }); // If post not found, return 404
    }

    res.status(200).json(updatedPost); // Return the updated post as JSON
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
    try {
    const postId = req.params.id; // Get the post ID from the request parameters

    const deletedPost = await Post.findByIdAndDelete(postId); // Delete the post by ID

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" }); // If post not found, return 404
    }

    res.status(200).json({ message: "Post deleted successfully" }); // Return success message
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};