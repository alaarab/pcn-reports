var Sequelize = require("sequelize");
require("dotenv").config();
var session = require("express-session");

const SequelizeStore = require("connect-session-sequelize")(session.Store);

var sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: "postgres",
  }
);

export default function sessionMiddleware(req, res, next) {
  const sessionSecret = process.env.SESSION_SECRET || uuidv4();

  return session({
    name: "session",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    store: new SequelizeStore({
      db: sequelize,
    }),
  })(req, res, next);
}

new SequelizeStore({
  db: sequelize,
}).sync();
