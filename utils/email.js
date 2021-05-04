const nodemailer = require('nodemailer');
const nodemailerMailgun = require('nodemailer-mailgun-transport');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const config = require('../config/config');

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.username = user.firstname;
		this.url = url;
		this.from = `Temitayo from Expressy <${config.EMAIL_FROM}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			const auth = {
				auth: {
					api_key: `${process.env.MAILGUN_API_KEY}`,
					domain: `${process.env.MAILGUN_DOMAIN}`,
				},
			};
			//Mailgun
			return nodemailer.createTransport(nodemailerMailgun(auth));
		} else {
			const auth = {
				service: 'gmail',
				auth: {
					user: `${config.EMAIL_FROM}`,
					pass: `${config.EMAIL_PASS}`,
				},
			};

			// To use mailgun in development
			return nodemailer.createTransport(auth);
		}
	}

	async send(template, subject, info = '') {
		// 1) Render HTML based on a PUG template

		const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
			username: this.firstname,
			url: this.url,
			subject,
			info,
		});

		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText(html),
		};

		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to Expressy');
	}

	async sendPasswordReset() {
		await this.send('passwordReset', 'Reset your Password (Url valid for 10 mins)');
	}
};
