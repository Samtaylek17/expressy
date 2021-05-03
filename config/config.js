const config = {
	NODE_ENV: process.env.NODE_ENV,
	DATABASE_PROD: process.env.DATABASE_PROD,
	DATABASE_PASS: process.env.DATABASE_PASS,
	DATABASE_LOCAL: process.env.DATABASE_LOCAL,
	PORT: process.env.PORT,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
	JWT_COOKIES_EXPIRES_IN: process.env.JWT_COOKIES_EXPIRES_IN,
};

module.exports = config;
