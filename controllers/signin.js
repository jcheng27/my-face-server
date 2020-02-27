const handleSignin = (bcrypt,postgresDB)=> (req,res) => {

bcrypt.compare("apples", "$2b$10$S/ukIgxPEce3aQQ57MwLnOPQDzxFI4ydCLk65N5QmFaXnQxxb6VBa", function(err, result) {
    console.log("first guess",result)
});
bcrypt.compare("bacon", "$2b$10$S/ukIgxPEce3aQQ57MwLnOPQDzxFI4ydCLk65N5QmFaXnQxxb6VBa", function(err, result) {
    console.log("second guess",result)
});

	postgresDB.select('email','hash').from('login').where('email','=',req.body.email)
		.then(response => {
			bcrypt.compare(req.body.password, response[0].hash, function(err, result) {
    			console.log("Does the passwork work?",result);
    			if (result) {
    				return postgresDB.select('*').from('users').where('email','=',req.body.email)
	    				.then (userprofile => {
	    					res.json(userprofile[0])
    				})
    				.catch(err => res.status(400).json('unable to get this user'))
    			}
    			else { 
    				res.status(400).json('wrong password')
    			}
			});
		})
		.catch(err => res.status(400).json('caught on error'))

}

module.exports = {
	handleSignin: handleSignin
};