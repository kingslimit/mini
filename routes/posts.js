// routes/posts.js - CRUD untuk Posts
import { Router } from "express";
const router = Router();
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";

// GET semua posts (tanpa auth - public)
router.get("/", async (req, res) => {
	try {
		const posts = await Post.find().sort({ timestamp: -1 }); // Sort descending
		res.json(posts);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching posts", error: error.message });
	}
});

// GET single post by ID (public)
router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		res.json(post);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching post", error: error.message });
	}
});

// POST create new post (protected - harus login)
router.post("/", auth, async (req, res) => {
	try {
		const { title, content } = req.body;

		// Validasi input
		if (!title || !content) {
			return res
				.status(400)
				.json({ message: "Title and content are required" });
		}

		const newPost = new Post({
			title,
			content,
			author: req.session.user.username, // Ambil username dari session
			timestamp: new Date(),
			likes: 0,
			comments: [],
		});

		const savedPost = await newPost.save();
		res.status(201).json(savedPost);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error creating post", error: error.message });
	}
});

// PUT update post (protected - hanya owner)
router.put("/:id", auth, async (req, res) => {
	try {
		const { title, content } = req.body;

		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Cek apakah user adalah owner
		if (post.author !== req.session.user.username) {
			return res
				.status(403)
				.json({ message: "Tidak punya akses untuk edit post ini" });
		}

		const updatedPost = await Post.findByIdAndUpdate(
			req.params.id,
			{ title, content },
			{ new: true, runValidators: true },
		);

		res.json(updatedPost);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error updating post", error: error.message });
	}
});

// DELETE post (protected - hanya owner)
router.delete("/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Cek apakah user adalah owner
		if (post.author !== req.session.user.username) {
			return res
				.status(403)
				.json({ message: "Tidak punya akses untuk hapus post ini" });
		}

		await Post.findByIdAndDelete(req.params.id);
		res.json({ message: "Post deleted successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error deleting post", error: error.message });
	}
});

export default router;
