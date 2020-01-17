//Imports
console.log('Initializing dependencies...');
const config = require('./config/config');
var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || config.port;
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var apiv1 = require('./routes/apiv1');

//Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/uploads', express.static(path.join(__dirname, config.uploadPath)));

//Connect to the MongoDB
console.log('Database connecting to ' + config.mongodbURL + '...');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodbURL, config.mongoDbOptions);
mongoose.connection.on('connected', () => {
	console.log('Connected successfully.');
	//Setup API routes
	console.log('Registering routes... ');
	app.use('/api/v1', apiv1);
	//Register Port
	app.listen(port, () => console.log('Listening on port ' + port)).keepAliveTimeout = 500;
	console.log('BB Portal RESTful API server started...');
});

//Exit script if cannot connect to the Database
mongoose.connection.on('error', (err) => {
	console.log('Connection error. ' + err);
	process.exit(0);
});
