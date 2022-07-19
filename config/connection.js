// Import the Sequelize constructor from the library
const Sequelize = require('sequelize');

require('dotenv').config();

// Create connection to our database, pass in your MySQL information for username and password. The
// process.env sequences instructs the app that if the production environment provides whatever
// the proceeding item is, then we should use that one. process.env.DB_NAME is whatever database
// name is provided. process.env.PORT uses whatever PORT is provided by the production environment.
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;