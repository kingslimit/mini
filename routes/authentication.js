import { Router } from "express";
import bcrypt from "bcrypt";
const router = Router();
import User from "../models/User.js";

// REGISTER
router.post("/register", async (req, res) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		return res.status(400).json({ msg: "Semua field harus diisi" });
	}

	try {
		// Cek apakah username atau email sudah ada
		const existingUser = await User.findOne({ $or: [{ username }, { email }] });
		if (existingUser) {
			return res
				.status(400)
				.json({ msg: "Username atau email sudah digunakan" });
		}

		const hashed = await bcrypt.hash(password, 10);
		const user = new User({ username, email, password: hashed });
		await user.save();

		res.json({ msg: "User berhasil dibuat" });
	} catch (err) {
		res.status(400).json({ msg: err.message });
	}
});

// LOGIN
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ msg: "Username dan password harus diisi" });
	}

	try {
		const user = await User.findOne({ username });
		if (!user) return res.status(400).json({ msg: "User tidak ditemukan" });

		const match = await bcrypt.compare(password, user.password);
		if (!match) return res.status(400).json({ msg: "Password salah" });

		req.session.user = { id: user._id, username: user.username };
		res.json({ msg: "Login berhasil", username: user.username });
	} catch (err) {
		res.status(500).json({ msg: "Error saat login" });
	}
});

// LOGOUT
router.post("/logout", (req, res) => {
	req.session.destroy(() => {
		res.json({ msg: "Logout berhasil" });
	});
});

// GET current user (protected route)
router.get("/me", async (req, res) => {
	if (!req.session.user) {
		return res.status(401).json({ msg: "Tidak terautentikasi" });
	}

	try {
		const user = await User.findById(req.session.user.id).select("-password");
		res.json(user);
	} catch (err) {
		res.status(500).json({ msg: "Error mengambil data user" });
	}
});

export default router;
