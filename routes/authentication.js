import { Router } from "express";
const router = Router();
import User from "../models/User.js";

router.post("/register", async (req, res) => {
	const { username, password } = req.body;
	const hashed = await bcrypt.hash(password, 10);

	try {
		const user = new User({ username, password: hashed });
		await user.save();
		res.json({ msg: "User berhasil dibuat" });
	} catch (err) {
		res.status(400).json({ msg: err.message });
	}
});

// LOGIN
router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });
	if (!user) return res.status(400).json({ msg: "User tidak ditemukan" });

	const match = await bcrypt.compare(password, user.password);
	if (!match) return res.status(400).json({ msg: "Password salah" });

	req.session.user = { id: user._id, username: user.username };
	res.json({ msg: "Login berhasil" });
});

// LOGOUT
router.post("/logout", (req, res) => {
	req.session.destroy(() => {
		res.json({ msg: "Logout berhasil" });
	});
});

// PROTECTED route contoh
router.get("/me", async (req, res) => {
	const user = await User.findById(req.session.user.id).select("-password");
	res.json(user);
});

export default router;
