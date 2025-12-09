// routes/comments.js - CRUD untuk Comments (nested)
import { Router } from "express";
const router = Router();
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";

// POST add comment to a post (protected - harus login)
router.post("/:postId", auth, async (req, res) => {
    try {
        const { text } = req.body;

        // Validasi input
        if (!text) {
            return res.status(400).json({ message: "Text is required" });
        }

        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Tambah comment baru ke array comments
        const newComment = {
            user: req.session.user.username, // Ambil username dari session
            text,
            timestamp: new Date(),
        };

        post.comments.push(newComment);
        await post.save();

        res.status(201).json({
            message: "Comment added successfully",
            comment: post.comments[post.comments.length - 1],
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
});

// GET all comments from a post (public)
router.get("/:postId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(post.comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
});

// PUT update a comment (protected - hanya owner)
router.put("/:postId/:commentId", auth, async (req, res) => {
    try {
        const { text } = req.body;

        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Cari comment by ID
        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Cek apakah user adalah owner comment
        if (comment.user !== req.session.user.username) {
            return res.status(403).json({ message: "Tidak punya akses untuk edit comment ini" });
        }

        // Update comment text
        comment.text = text;
        await post.save();

        res.json({ message: "Comment updated successfully", comment });
    } catch (error) {
        res.status(500).json({ message: "Error updating comment", error: error.message });
    }
});

// DELETE a comment (protected - hanya owner)
router.delete("/:postId/:commentId", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Cari comment by ID
        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Cek apakah user adalah owner comment
        if (comment.user !== req.session.user.username) {
            return res.status(403).json({ message: "Tidak punya akses untuk hapus comment ini" });
        }

        // Hapus comment by ID menggunakan pull
        post.comments.pull(req.params.commentId);
        await post.save();

        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment", error: error.message });
    }
});

export default router;
