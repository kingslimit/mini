// routes/posts.js - CRUD untuk Posts
import { Router } from "express";
const router = Router();
import Post from "../models/Post.js";

// GET semua posts (dengan sorting berdasarkan timestamp terbaru)
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

// GET single post by ID
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

// POST create new post
router.post("/", async (req, res) => {
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

// PUT update post
router.put("/:id", async (req, res) => {
	try {
		const { title, content } = req.body;

		const updatedPost = await Post.findByIdAndUpdate(
			req.params.id,
			{ title, content },
			{ new: true, runValidators: true }, // Return updated document
		);

		if (!updatedPost) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.json(updatedPost);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error updating post", error: error.message });
	}
});

// DELETE post
router.delete("/:id", async (req, res) => {
	try {
		const deletedPost = await Post.findByIdAndDelete(req.params.id);

		if (!deletedPost) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.json({ message: "Post deleted successfully", post: deletedPost });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error deleting post", error: error.message });
	}
});

export default router;
