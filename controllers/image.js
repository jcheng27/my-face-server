const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'e228f330f1df4bad9c6c1b7bc70f578a'
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req,res,postgresDB)=> {
	const { id } = req.body;

	postgresDB('users').where('id', '=', id)
		.increment('entries',1)
		.returning('entries')
		.then(result => {
			console.log(result);
			res.json(result[0]);
		})
		.catch(err => {res.status(400).json('Unable to get entries')})
}

module.exports = {
	handleImage,
	handleApiCall
}