const db = require("../database/dbConfig");

module.exports = {
	getBy,
	create,
};

function getBy(filter) {
	return db("users").where(filter);
}

function create(user) {
	return db("users")
		.insert(user)
		.then(([id]) => getBy({ id }));
}
