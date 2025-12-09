// server.js - Entry Point Utama Server
import express from "express";
import mongoose from "mongoose";
import path from "path";
import session from "express-session";
import Post from "./models/Post.js";

const app = express();
const PORT = 3000;

// Middleware untuk parsing JSON dan serving static files
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: "rahasia-super-aman",
		resave: false,
		saveUninitialized: false,
	}),
);

// Koneksi ke MongoDB lokal
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("✅ Connected to MongoDB");
		// Insert dummy data setelah koneksi berhasil
		insertDummyData();
	})
	.catch((err) => console.error("❌ MongoDB connection error:", err));

// Import routes
import postsRouter from "./routes/posts.js";
import likesRouter from "./routes/likes.js";
import commentsRouter from "./routes/comments.js";
import autheRouter from "./routes/authentication.js";

// Gunakan routes
app.use("/api/posts", postsRouter);
app.use("/api/likes", likesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/auth", autheRouter);

// Route untuk halaman utama
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Function untuk insert dummy data
async function insertDummyData() {
	// Cek apakah sudah ada data
	const count = await Post.countDocuments();
	if (count > 0) {
		console.log("📊 Dummy data already exists");
		return;
	}

	// Data dummy
	const dummyPosts = [
		{
			title: "Apa itu Node.js?",
			content:
				"Node.js adalah runtime environment JavaScript yang dibangun di atas V8 engine Chrome. Sangat cocok untuk membuat aplikasi web scalable!",
			likes: 15,
			comments: [
				{
					user: "Budi",
					text: "Penjelasan yang bagus! Saya jadi paham sekarang.",
					timestamp: new Date("2024-12-08"),
				},
				{
					user: "Ani",
					text: "Apakah Node.js sulit dipelajari untuk pemula?",
					timestamp: new Date("2024-12-08"),
				},
			],
			timestamp: new Date("2024-12-07"),
		},
		{
			title: "Tips Belajar MongoDB",
			content:
				"MongoDB adalah NoSQL database yang sangat fleksibel. Untuk pemula, mulailah dengan memahami konsep collection dan document terlebih dahulu.",
			likes: 23,
			comments: [
				{
					user: "Citra",
					text: "Terima kasih tipsnya! Sangat membantu.",
					timestamp: new Date("2024-12-08"),
				},
				{
					user: "Doni",
					text: "Apakah MongoDB lebih baik dari MySQL?",
					timestamp: new Date("2024-12-08"),
				},
				{
					user: "Admin",
					text: "Tergantung use case. MongoDB bagus untuk data tidak terstruktur.",
					timestamp: new Date("2024-12-09"),
				},
			],
			timestamp: new Date("2024-12-06"),
		},
		{
			title: "Kenapa Express.js Populer?",
			content:
				"Express.js adalah framework Node.js yang minimal dan fleksibel. Cocok untuk membuat API dengan cepat dan mudah!",
			likes: 8,
			comments: [
				{
					user: "Eko",
					text: "Express memang framework favorit saya!",
					timestamp: new Date("2024-12-09"),
				},
			],
			timestamp: new Date("2024-12-08"),
		},
		{
			title: "Cara Deploy Aplikasi Node.js",
			content:
				"Ada banyak platform untuk deploy seperti Heroku, Vercel, dan Railway. Pilih sesuai kebutuhan project Anda.",
			likes: 12,
			comments: [],
			timestamp: new Date("2024-12-09"),
		},
		{
			title: "Perbedaan Sync vs Async di JavaScript",
			content:
				"Synchronous code berjalan berurutan, sementara asynchronous memungkinkan operasi berjalan tanpa blocking thread utama.",
			likes: 19,
			comments: [
				{
					user: "Fani",
					text: "Async/await membuat kode lebih mudah dibaca!",
					timestamp: new Date("2024-12-09"),
				},
				{
					user: "Gani",
					text: "Bisa kasih contoh penggunaan Promise?",
					timestamp: new Date("2024-12-09"),
				},
			],
			timestamp: new Date("2024-12-05"),
		},
	];

	try {
		await Post.insertMany(dummyPosts);
		console.log("✨ Dummy data inserted successfully");
	} catch (error) {
		console.error("❌ Error inserting dummy data:", error);
	}
}

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
