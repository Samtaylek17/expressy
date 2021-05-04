const request = require('supertest');
const app = require('../../app');

it('returns a 201 on successful signup', async () => {
	return request(app)
		.post('/api/v1/user/signup')
		.send({
			firstname: 'Temitayo',
			lastname: 'Ogunsusi',
			email: 'samtaylek@gmail.com',
			password: '12345678',
			passwordConfirm: '12345678',
		})
		.expect(201);
});

it('returns a 400 if password and passwordConfirm are not the same', async () => {
	return request(app)
		.post('/api/v1/user/signup')
		.send({
			firstname: 'Temitayo',
			lastname: 'Ogunsusi',
			email: 'samtaylek@gmail.com',
			password: '12345679',
			passwordConfirm: '12345678',
		})
		.expect(400);
});

it('returns a 400 if an invalid email is supplied', async () => {
	return request(app)
		.post('/api/v1/user/signup')
		.send({
			firstname: 'Temitayo',
			lastname: 'Ogunsusi',
			email: 'samtaylekgmail.com',
			password: '12345679',
			passwordConfirm: '12345678',
		})
		.expect(400);
});

it('successfully logs a user in with correct email and password', async () => {
	await request(app)
		.post('/api/v1/user/signup')
		.send({
			firstname: 'Temitayo',
			lastname: 'Ogunsusi',
			email: 'samtaylek@gmail.com',
			password: '12345678',
			passwordConfirm: '12345678',
		})
		.expect(201);

	const response = await request(app)
		.post('/api/v1/user/login')
		.send({
			email: 'samtaylek@gmail.com',
			password: '12345678',
		})
		.expect(200);

	expect(response.get('Set-Cookie')).toBeDefined();
});

it('returns a 401 if user tries to login with a wrong email or password', async () => {
	await request(app)
		.post('/api/v1/user/signup')
		.send({
			firstname: 'Temitayo',
			lastname: 'Ogunsusi',
			email: 'samtaylek@gmail.com',
			password: '12345678',
			passwordConfirm: '12345678',
		})
		.expect(201);

	const response = await request(app)
		.post('/api/v1/user/login')
		.send({
			email: 'samtaylek@gmail.com',
			password: '1234567',
		})
		.expect(401);

	expect(response.get('Set-Cookie')).toBeUndefined();
});

it('clears the cookie after signing out', async () => {
	await request(app)
		.post('/api/v1/user/signup')
		.send({
			firstname: 'Temitayo',
			lastname: 'Ogunsusi',
			email: 'samtaylek@gmail.com',
			password: '12345678',
			passwordConfirm: '12345678',
		})
		.expect(201);

	const response = await request(app).get('/api/v1/user/logout').send({}).expect(200);

	expect(response.get('Set-Cookie')).toBeDefined();
});
