const handleProfileGet = (req,res,postgresDB) => {
	
	const { id } = req.params;

	postgresDB.select('*').from('users').where({id: id})
		.then(response => {
			if (response.length) {
				console.log(response[0]);
				res.json(response[0]);
			}
			else {
				res.status(400).json('User not found')
			}
		})
		.catch(err => res.status(400).json('There was an error'))

}

module.exports = {
	handleProfileGet
};