// models/Post.js - Schema untuk Post
const mongoose = require('mongoose');

// Schema untuk Comment (nested di dalam Post)
const commentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Schema untuk Post
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [commentSchema] // Array of comments (nested)
});

// Virtual field untuk menghitung jumlah komentar
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Pastikan virtual fields ter-include saat convert ke JSON
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;