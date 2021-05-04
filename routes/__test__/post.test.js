const request = require('supertest');
const app = require('../../app');

it('Publishes a post with valid credentials with media upload', async () => {
	const cookie = await global.setCookie();
	return request(app)
		.post('/api/v1/post/new')
		.set('Cookie', cookie)
		.field('title', 'I see the moon')
		.field('body', 'I see the moon, the moon see me, God bless the moon, God bless me')
		.attach('media', '/Users/samtaylek/Documents/TalentQL/public/big_shot_4_2x.png')
		.expect(201);
});

it('Publishes a post without media upload', async () => {
	const cookie = await global.setCookie();
	return request(app)
		.post('/api/v1/post/new')
		.set('Cookie', cookie)
		.send({
			title: 'I see the moon',
			body: 'I see the moon, the moon see me, God bless the moon, God bless me',
		})
		.expect(201);
});

it('returns a collection of posts', async () => {
	const cookie = await global.setCookie();
	const title = 'I see the moon';
	const body = 'I see the moon, the moon see me, God bless the moon, God bless me';

	await request(app)
		.post('/api/v1/post/new')
		.set('Cookie', cookie)
		.send({
			title,
			body,
		})
		.expect(201);

	const response = await request(app).get('/api/v1/post').set('Cookie', cookie).expect(200);

	expect(response.body.post).toBeDefined();
});

it('returns a single post', async () => {
	const cookie = await global.setCookie();
	const title = 'I see the moon';
	const body = 'I see the moon, the moon see me, God bless the moon, God bless me';

	const result = await request(app)
		.post('/api/v1/post/new')
		.set('Cookie', cookie)
		.send({
			title,
			body,
		})
		.expect(201);

	const response = await request(app).get(`/api/v1/post/${result.body.post.id}`).set('Cookie', cookie).expect(200);

	expect(response.body.post.title).toEqual(title);
	expect(response.body.post.body).toEqual(body);
});

it('updates a post', async () => {
	const title = 'I see the moon';
	const body = 'I see the moon, the moon see me, God bless the moon, God bless me, mo ri osupa';
	const cookie = await global.setCookie();

	const result = await request(app)
		.post('/api/v1/post/new')
		.set('Cookie', cookie)
		.field('title', 'I see the moon')
		.field('body', 'I see the moon, the moon see me, God bless the moon, God bless me')
		.attach('media', '/Users/samtaylek/Documents/TalentQL/public/big_shot_4_2x.png')
		.expect(201);

	const response = await request(app)
		.patch(`/api/v1/post/${result.body.post.id}`)
		.set('Cookie', cookie)
		.field('title', title)
		.field('body', body)
		.attach('media', '/Users/samtaylek/Documents/TalentQL/public/appqqaa.png')
		.expect(200);

	expect(response.body.post.title).toEqual(title);
	expect(response.body.post.body).toEqual(body);
});

it('deletes a post', async () => {
	const title = 'I see the moon';
	const body = 'I see the moon, the moon see me, God bless the moon, God bless me, mo ri osupa';
	const cookie = await global.setCookie();

	const result = await request(app)
		.post('/api/v1/post/new')
		.set('Cookie', cookie)
		.field('title', title)
		.field('body', body)
		.attach('media', '/Users/samtaylek/Documents/TalentQL/public/big_shot_4_2x.png')
		.expect(201);

	const response = await request(app).delete(`/api/v1/post/${result.body.post.id}`).set('Cookie', cookie).expect(204);

	expect(response.body).toBeEmpty();
});

it('adds comment to a post', async () => {
	const title = 'I see the moon';
	const body = 'I see the moon, the moon see me, God bless the moon, God bless me, mo ri osupa';
	const cookie = await global.setCookie();

	const result = await request(app)
		.post('/api/v1/post/new')
		.set('Cookie', cookie)
		.field('title', title)
		.field('body', body)
		.attach('media', '/Users/samtaylek/Documents/TalentQL/public/big_shot_4_2x.png')
		.expect(201);

	const response = await request(app)
		.post(`/api/v1/post/${result.body.post.id}/add-comment`)
		.set('Cookie', cookie)
		.field('comment', 'This used to be my best nursery rhyme back then')
		.attach('media', '/Users/samtaylek/Documents/TalentQL/public/appqqaa.png')
		.expect(201);
});
