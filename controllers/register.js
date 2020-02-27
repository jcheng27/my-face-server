const handleRegister = (req,res,bcrypt,postgresDB,saltRounds) => {
	const { name, email, password } = req.body;

	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission')
	}

	//sync method
	var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(password, salt);


	//async method
	// bcrypt.hash(password, saltRounds, function(err, hash) {
	//   console.log(hash);
	// });

	postgresDB.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
				name: name,
				email: loginEmail[0],
				joined: new Date()
			}).then(response => {
				res.json(response[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('Error'))
}

module.exports = {
	handleRegister: handleRegister
};