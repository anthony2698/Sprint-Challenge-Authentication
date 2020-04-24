const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../users/users-model");

router.post("/register", (req, res) => {
	const user = req.body;

	if (user.username && user.password) {
		const hash = bcrypt.hashSync(user.password, 10);
		user.password = hash;

		Users.create(user)
			.then(([user]) => res.status(201).json(user))
			.catch((err) => {
				console.log(err);
				res.status(500).json({ error: err.message });
			});
	} else {
		res
			.status(400)
			.json({ message: "User must contain username and password" });
	}
});

router.post("/login", (req, res) => {
	const { username, password } = req.body;

	Users.getBy({ username })
		.then(([user]) => {
			if (user && bcrypt.compareSync(password, user.password)) {
				const token = generateToken(user);

				res.status(200).json({ token });
			} else {
				res.status(401).json({ message: "Invalid username or password" });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err.message });
		});
});

function generateToken({ username }) {
	const payload = {
		username,
	};

	const options = {
		expiresIn: "10m",
	};

	return jwt.sign(payload, process.env.JWT_SECRET || "asid08ay9f", options);
}

module.exports = router;
