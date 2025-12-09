import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Post from "./models/Post.js";

const MONGODB_URI =
	process.env.MONGO_URL || "mongodb://localhost:27017/quoraclone";

// Data dummy users
const users = [
	{
		username: "john_doe",
		email: "john@example.com",
		password: "password123",
	},
	{
		username: "jane_smith",
		email: "jane@example.com",
		password: "password123",
	},
	{
		username: "bob_wilson",
		email: "bob@example.com",
		password: "password123",
	},
	{
		username: "alice_brown",
		email: "alice@example.com",
		password: "password123",
	},
];

// Data dummy posts
const posts = [
	{
		title: "Apa itu JavaScript?",
		content:
			"JavaScript adalah bahasa pemrograman yang digunakan untuk membuat website interaktif. Bagaimana cara terbaik untuk mempelajarinya?",
		author: "john_doe",
		likes: 15,
		comments: [
			{
				user: "jane_smith",
				text: "Mulai dengan dasar-dasar seperti variabel, function, dan DOM manipulation. Saya rekomendasikan untuk praktek langsung dengan membuat project kecil.",
				timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 jam lalu
			},
			{
				user: "bob_wilson",
				text: "FreeCodeCamp dan MDN docs adalah resources yang bagus untuk belajar JavaScript dari nol.",
				timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 jam lalu
			},
		],
	},
	{
		title: "Perbedaan React vs Vue?",
		content:
			"Saya sedang bingung memilih antara React dan Vue untuk project baru. Apa kelebihan dan kekurangan masing-masing?",
		author: "jane_smith",
		likes: 23,
		comments: [
			{
				user: "john_doe",
				text: "React punya ecosystem yang lebih besar dan lebih banyak job opportunities. Tapi Vue lebih mudah dipelajari untuk pemula.",
				timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
			},
			{
				user: "alice_brown",
				text: "Keduanya bagus! React lebih flexible tapi butuh belajar lebih banyak konsep. Vue lebih opinionated dan dokumentasinya sangat bagus.",
				timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
			},
			{
				user: "bob_wilson",
				text: "Saya prefer Vue karena syntaxnya lebih intuitif dan mudah di-integrate ke project existing.",
				timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
			},
		],
	},
	{
		title: "Tips belajar programming untuk pemula?",
		content:
			"Halo semuanya! Saya baru mulai belajar programming. Ada tips dan trik untuk pemula seperti saya?",
		author: "bob_wilson",
		likes: 42,
		comments: [
			{
				user: "jane_smith",
				text: "Konsisten adalah kunci! Coding setiap hari meskipun hanya 30 menit akan lebih efektif daripada belajar 8 jam di akhir pekan saja.",
				timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
			},
			{
				user: "alice_brown",
				text: "Jangan hanya menonton tutorial! Praktek langsung dan buat project sendiri. Belajar dari error adalah cara terbaik.",
				timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
			},
			{
				user: "john_doe",
				text: "Join komunitas developer, ikut forum atau Discord. Belajar bareng dengan orang lain sangat membantu motivasi.",
				timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
			},
		],
	},
	{
		title: "Bagaimana cara kerja REST API?",
		content:
			"Saya sering dengar tentang REST API tapi masih belum begitu paham konsepnya. Bisa dijelaskan dengan bahasa yang sederhana?",
		author: "alice_brown",
		likes: 18,
		comments: [
			{
				user: "john_doe",
				text: "REST API adalah cara untuk aplikasi berkomunikasi lewat HTTP. Seperti waiter yang mengantarkan pesanan kamu ke kitchen (server) dan membawa kembali makanan (data).",
				timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
			},
			{
				user: "bob_wilson",
				text: "Basically ada 4 method utama: GET (ambil data), POST (buat data baru), PUT (update data), DELETE (hapus data). Setiap endpoint punya URL yang berbeda.",
				timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
			},
		],
	},
	{
		title: "MongoDB vs MySQL, pilih yang mana?",
		content:
			"Untuk aplikasi web modern, lebih baik pakai MongoDB (NoSQL) atau MySQL (SQL)?",
		author: "john_doe",
		likes: 31,
		comments: [
			{
				user: "jane_smith",
				text: "Tergantung kebutuhan. Kalau datanya structured dan butuh relasi kompleks, pakai MySQL. Kalau datanya flexible dan sering berubah structure, MongoDB lebih cocok.",
				timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
			},
		],
	},
	{
		title: "Apa itu Git dan kenapa penting?",
		content:
			"Saya masih belajar programming dan sering dengar tentang Git. Apa sebenarnya Git itu dan kenapa semua developer pakai?",
		author: "bob_wilson",
		likes: 27,
		comments: [
			{
				user: "alice_brown",
				text: "Git adalah version control system. Bayangkan seperti 'save point' di game, kamu bisa kembali ke versi sebelumnya kalau ada yang salah.",
				timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
			},
			{
				user: "john_doe",
				text: "Git juga memudahkan kolaborasi. Banyak orang bisa kerja di project yang sama tanpa saling overwrite code.",
				timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
			},
		],
	},
	{
		title: "Rekomendasi text editor untuk coding?",
		content:
			"VSCode, Sublime, atau Atom? Mana yang paling bagus untuk web development?",
		author: "jane_smith",
		likes: 12,
		comments: [
			{
				user: "bob_wilson",
				text: "VSCode hands down! Gratis, banyak extension, dan sangat customizable. Plus built-in terminal dan Git integration.",
				timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
			},
		],
	},
	{
		title: "Cara deploy aplikasi Node.js?",
		content:
			"Aplikasi Node.js saya sudah jadi di local. Bagaimana cara deploy ke internet supaya bisa diakses orang lain?",
		author: "alice_brown",
		likes: 35,
		comments: [
			{
				user: "john_doe",
				text: "Untuk pemula, coba Heroku atau Railway. Setup-nya simple dan ada free tier. Tinggal push code ke Git dan mereka handle deployment-nya.",
				timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
			},
			{
				user: "jane_smith",
				text: "Vercel juga bagus untuk fullstack app. Atau kalau mau lebih control, bisa pakai VPS seperti DigitalOcean.",
				timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
			},
		],
	},
];

async function seedDatabase() {
	try {
		console.log("🌱 Starting database seeding...");

		// Connect to MongoDB
		await mongoose.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("✅ Connected to MongoDB");

		// Clear existing data
		console.log("🗑  Clearing existing data...");
		await User.deleteMany({});
		await Post.deleteMany({});
		console.log("✅ Existing data cleared");

		// Create users
		console.log("👤 Creating users...");
		const hashedUsers = await Promise.all(
			users.map(async (user) => {
				const hashedPassword = await bcrypt.hash(user.password, 10);
				return {
					username: user.username,
					email: user.email,
					password: hashedPassword,
				};
			}),
		);
		await User.insertMany(hashedUsers);
		console.log(`✅ Created ${hashedUsers.length} users`);

		// Create posts with timestamps
		console.log("📝 Creating posts...");
		const postsWithTimestamps = posts.map((post, index) => ({
			...post,
			timestamp: new Date(
				Date.now() - (posts.length - index) * 24 * 60 * 60 * 1000,
			), // Posts dari beberapa hari lalu
		}));
		await Post.insertMany(postsWithTimestamps);
		console.log(`✅ Created ${postsWithTimestamps.length} posts`);

		// Summary
		console.log("\n📊 Seeding Summary:");
		console.log(`   Users: ${hashedUsers.length}`);
		console.log(`   Posts: ${postsWithTimestamps.length}`);
		console.log(
			`   Comments: ${posts.reduce((sum, post) => sum + post.comments.length, 0)}`,
		);

		console.log("\n👥 Test Accounts:");
		users.forEach((user) => {
			console.log(`   Username: ${user.username} | Password: ${user.password}`);
		});

		console.log("\n✨ Database seeding completed successfully!");
	} catch (error) {
		console.error("❌ Error seeding database:", error);
	} finally {
		await mongoose.connection.close();
		console.log("🔌 Database connection closed");
	}
}

// Run seeding
seedDatabase();
