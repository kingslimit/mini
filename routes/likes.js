// routes/likes.js - Like/Unlike System
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// POST like a post (increment likes)
router.post('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment likes
    post.likes += 1;
    await post.save();

    res.json({ 
      message: 'Post liked successfully', 
      likes: post.likes 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
});

// DELETE unlike a post (decrement likes)
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Decrement likes (tidak boleh negatif)
    if (post.likes > 0) {
      post.likes -= 1;
    }
    await post.save();

    res.json({ 
      message: 'Post unliked successfully', 
      likes: post.likes 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking post', error: error.message });
  }
});

module.exports = router;