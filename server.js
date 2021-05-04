const mongoose = require('mongoose');
const config = require('./config/config');

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! Shutting down...');
	console.log(err, err.name, err.message);
	process.exit(1);
});

const app = require('./app');
// Use production DB if environment is in production
if (config.NODE_ENV === 'production') {
	const DB = config.DATABASE_PROD.replace('<password>', config.DATABASE_PASS);

	mongoose
		.connect(DB, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		})
		.then(() => console.log('DB connection successful'));
} else {
	mongoose
		.connect(config.DATABASE_LOCAL, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		})
		.then(() => console.log('DB connection successful'));
}

const port = config.PORT || 5003;

const server = app.listen(port, () => {
	console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message);
	console.log('UNHANDLED REJECTION! Shutting down...');
	server.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
	server.close(() => {
		console.log('🔥 Process terminated!');
	});
});
