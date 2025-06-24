const mongoose = require('mongoose');
// const { type } = require('os');
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 200, // Maximum length for title
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  author_id: {
    type: String,
    require: true,
  },
  author_name: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }], // 
  image: {
    type: String,
    required: true,
    default: 'uploads/nkceno.png'
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
}, {timestamps: true}); 

// Create a Mongoose model based on the schema
const Post = mongoose.model('Post', postSchema);
module.exports = Post