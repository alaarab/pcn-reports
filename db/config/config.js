require("dotenv").config();

("use strict");
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    pool: {
      max: 30,
      min: 5,
      idle: 10000,
      acquire: 30000
    }
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 30,
      min: 5,
      idle: 10000,
      acquire: 30000
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    pool: {
      max: 30,
      min: 5,
      idle: 10000,
      acquire: 30000
    }
    // dialectOptions: {
    //   ssl: true,
    // },
  },
};
