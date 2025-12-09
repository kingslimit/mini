import express from "express";
import mongoose from "mongoose";
import session from "express-session";

// Import routes
import authRoutes from "./routes/authentication.js";
import postsRoutes from "./routes/posts.js";
import commentsRoutes from "./routes/comments.js";
import likesRoutes from "./routes/likes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
	secret: process.env.SESSION_SECRET || "quoraclone-secret-key-change-this",
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false, // Set true jika pakai HTTPS
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000 // 24 jam
	}
}));

// Serve static files (HTML, CSS, JS)
app.use(express.static("public"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/likes", likesRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/quoraclone", {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => {
	console.log("✅ Connected to MongoDB");
	app.listen(PORT, () => {
		console.log(`🚀 Server running on http://localhost:${PORT}`);
	});
})
.catch(err => {
	console.error("❌ MongoDB connection error:", err);
});
