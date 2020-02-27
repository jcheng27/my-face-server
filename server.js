const express = require('express');

const app = express();
const cors = require('cors');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const knex = require('knex');

const postgresDB = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smart-brain'
  }
});

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

app.use(cors());
app.use(express.json());

app.get('/', (req,res)=> {
	
	postgresDB.select('*').from('users').then(data => {res.json(data)});
	
	//res.send('this is working');
	//res.send(database.users);
})


//using dependency injection from a controller
//compare the function for handleSignin vs handleRegister
app.post('/signin', (req,res) => {signin.handleSignin(bcrypt,postgresDB)(req,res) } )
app.post('/register', (req,res) => {register.handleRegister(req,res,bcrypt,postgresDB,saltRounds)} )
app.get('/profile/:id' , (req,res) => {profile.handleProfileGet(req,res,postgresDB)} )
app.put('/image' , (req,res) => {image.handleImage(req,res,postgresDB)} )
app.post('/imageurl' , (req,res) => {image.handleApiCall(req,res)} )

app.listen(1234, ()=> {
	console.log('app is running on port 1234');
})