export default function auth(req, res, next) {
	if (!req.session.user) {
		return res.status(401).json({ msg: "Harus login dulu" });
	}
	next();
}
