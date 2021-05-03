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
		this.from = `Temitayo from DevChat <${config.EMAIL_FROM}>`;
	}

	newTransport() {
		const auth = {
			auth: {
				api_key: `${config.MAILGUN_API_KEY}`,
				domain: `${config.MAILGUN_DOMAIN}`,
			},
		};

		if (config.NODE_ENV === 'production') {
			return nodemailer.createTransport(nodemailerMailgun(auth));
		}

		return nodemailer.createTransport(nodemailerMailgun(auth));
	}

	async send(template, subject, info = '') {
		// Render HTML based on a PUG template

		const html = pug.renderFile(`${__dirname}/...views/emails/${template}.pug`, {
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
		await this.send('Welcome', 'Welcome to DevChat');
	}
};
