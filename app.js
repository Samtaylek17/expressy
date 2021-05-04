const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const globalErrorHandler = require('./controllers/error_handlers');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const likeRouter = require('./routes/like');

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

// BODY PARSER, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
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

app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/like', likeRouter);

//for not found pages
//all http methods -> all()
// app.all('*', (req, res, next) => {
// 	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

app.use(globalErrorHandler);

// START SERVER
module.exports = app;
