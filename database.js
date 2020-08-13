const Sequelize = require('sequelize')

require('dotenv').config();

const dbUser = process.env.DB_USER;
const dbPw = process.env.DB_PSW;
const dbHost = process.env.DB_HOST;
const dbDb = process.env.DB_DATABASE;

const db = new Sequelize(dbDb, dbUser, dbPw, {
  host: dbHost,
  port: 5432,
  dialect: 'postgres',
  logging: false
})

module.exports = db;