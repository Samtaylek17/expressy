# Expressy

A platform to express your creative ideas through writing

# Getting Started with Expressy

This project was built with NodeJs and Express

## API Documentation

The API documentation is hosted on Postman visit [https://documenter.getpostman.com/view/9144454/TzRRDTz4] to access the
documentation

## Available Scripts

To get this project running, you need to have Nodejs and npm installed. In the project directory, you can run:

### `npm install`

Installs all the project dependencies including dev dependencies.

### `npm run dev`

Runs the app in the development mode.\
App runs on port 5001

### `npm run prod`

Runs the app in the production mode.\
App runs on port 5001

### `npm test`

Launches the test runner in the interactive watch mode.

## Environment Variables

Check the config.js file inside the config directory, you will find all necessary variables needed to run these project.
All Environment Secrets have been added to Github secret. You can request permission to this variables by sending an
email to [Temitayo Ogunsusi](mailto:ogunsusitemitayo99@gmail.com?subject=[GitHub]%20Expressy%20Environment%20Variables)

_Note_: You need to create a cloudinary account to get an API_KEY and a DOMAIN, same goes for the email notification, I
used MAILGUN, you need to create a MAILGUN Account.

If you want to use my own environment variables, you can send an email to
[Temitayo Ogunsusi](mailto:ogunsusitemitayo99@gmail.com?subject=[GitHub]%20Expressy%20Environment%20Variables), I will
respond as soon as possible.

## Setting up database

To run the project in development mode you will need to have mongodb installed.

To run the app in production mode, I created a database cluster on MongoDB cloud, you can also create on and add the
configuration to config.js
