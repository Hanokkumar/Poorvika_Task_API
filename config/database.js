const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log("DB Config:", process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME); 

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log,
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.error('Database connection failed:', err));

module.exports = sequelize;
