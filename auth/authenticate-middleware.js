const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const token = req.headers.authorization;

	jwt.verify(
		token,
		process.env.JWT_SECRET || "asid08ay9f",
		(err, decodedToken) => {
			if (err) {
				console.log(err);
				res.status(401).json({ message: "Invalid credentials" });
			} else {
				req.decodedToken = decodedToken;

				next();
			}
		}
	);
};