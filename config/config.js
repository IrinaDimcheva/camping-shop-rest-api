const env = process.env.NODE_ENV || 'development';

const config = {
	development: {
		port: process.env.PORT || 5000,
		dbURL: process.env.MONGO_ATLAS_DB_URL,
		origin: ['http://localhost:5555', 'http://localhost:4200', 'http://localhost:3000', 'http://localhost:3001']
	},
	production: {
		dbURL: process.env.MONGO_ATLAS_DB_URL,
		origin: []
	}
};

module.exports = config[env];
