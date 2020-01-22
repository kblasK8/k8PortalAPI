module.exports = {
	mongodbURL: "mongodb://localhost:27017/", // MongoDB URL connection
	mongoDbOptions: { // MongoDB configuration options
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		autoIndex: false, // Don't build indexes
		reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
		reconnectInterval: 500, // Reconnect every 500ms
		poolSize: 10, // Maintain up to 10 socket connections
		bufferMaxEntries: 0,
		connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
		socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
		family: 4, // Use IPv4, skip trying IPv6
		user: null, // MongoDB username
		pass: null, // MongoDB Password
		dbName: "PortalDB" // Database name
	},
	port: 3000, // API use port
	secretKey: "K8PortalAPI", // JWT secret key
	uploadPath: "./uploads/", // Upload folder path
};
