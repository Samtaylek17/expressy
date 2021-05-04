const request = require('supertest');
const app = require('../../app');

it('likes a post', async () => {
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

	await request(app).post(`/api/v1/like/${result.body.post.id}/like-post`).set('Cookie', cookie).send({}).expect(201);
});

it('unlike a post', async () => {
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

	await request(app).post(`/api/v1/like/${result.body.post.id}/like-post`).set('Cookie', cookie).send({}).expect(201);

	return request(app).post(`/api/v1/like/${result.body.post.id}/unlike-post`).set('Cookie', cookie).expect(204);
});
