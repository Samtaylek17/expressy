const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const app = require('../app');

jest.useFakeTimers();
jest.setTimeout(500000);

beforeAll(async () => {
	const response = await mongoose.connect(`${config.DATABASE_LOCAL}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	});
	// console.log(response);
	if (response) {
		console.log('DB connection successful');
	}
});

beforeEach(async () => {
	Object.keys(mongoose.connection.collections).forEach(async (key) => {
		await mongoose.connection.collections[key].deleteMany({});
	});
});

global.setCookie = async () => {
	const firstname = 'Temitayo';
	const lastname = 'Ogunsusi';
	const email = 'samtaylek@gmail.com';
	const password = '12345678';
	const passwordConfirm = password;

	await request(app)
		.post('/api/v1/user/signup')
		.send({
			firstname,
			lastname,
			email,
			password,
			passwordConfirm,
		})
		.expect(201);

	const response = await request(app)
		.post('/api/v1/user/login')
		.send({
			email,
			password,
		})
		.expect(200);

	const cookie = response.get('Set-Cookie');

	return cookie;
};

global.signin = async () => {
	// Build a JWT payload
	const payload = {
		id: new mongoose.Types.ObjectId(),
	};

	// Create the JWT!
	const token = jwt.sign(payload, config.JWT_SECRET, {
		expiresIn: config.JWT_EXPIRES_IN,
	});

	// Build session object
	const session = { jwt: token };

	// Turn that session into JSON
	const sessionJSON = JSON.stringify(session);

	// Take JSON and encode it as base64
	const base64 = Buffer.from(sessionJSON).toString('base64');

	// Return a string, that's the cookie with the encoded data
	return [`jwt=${base64}`];
};
