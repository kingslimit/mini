// models/Post.js - Schema untuk Post
import { Schema, model } from "mongoose";

// Schema untuk Comment (nested di dalam Post)
const commentSchema = new Schema({
	user: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

// Schema untuk Post
const postSchema = new Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
	content: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
	likes: {
		type: Number,
		default: 0,
	},
	comments: [commentSchema], // Array of comments (nested)
});

// Virtual field untuk menghitung jumlah komentar
postSchema.virtual("commentCount").get(function () {
	return this.comments.length;
});

// Pastikan virtual fields ter-include saat convert ke JSON
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

const Post = model("Post", postSchema);

export default Post;
