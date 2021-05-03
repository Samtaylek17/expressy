const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const globalErrorHandler = require('./controllers/error_handlers');

const app = express();

app.enable('trust proxy');

app.options('*', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

app.get('/', (req, res, next) => {
	res.send('<h2>Welcome to My Social App Api</h2>');
});

app.use(globalErrorHandler);

// START SERVER
module.exports = app;
