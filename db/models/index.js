"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

/* Custom handler for reading current working directory */
// const models = process.cwd() + "/db/models/" || __dirname;

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// // fs.readdirSync(__dirname)
// fs.readdirSync(models)
//   .filter((file) => {
//     return (
//       file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
//     );
//   })
//   .forEach((file) => {
//     // const model = require(path.join(__dirname, file))(
//     const model = require(path.join(models, file))(
//       sequelize,
//       Sequelize.DataTypes
//     );
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// fs.readdirSync("./models").forEach((file) => {
//   //const model = sequelize.import(path.join('./models', file));
//   const model = require(path.join(__dirname, "models", file))(
//     sequelize,
//     Sequelize
//   );
//   sequelize[model.name] = model;
// });

// const files = require.context('.', false, /\.js$/)
// files.keys().forEach(key => {
//   if (key === './index.js') return
//   db[key.replace(/(\.\/|\.js)/g, '')] = files(key)(sequelize, Sequelize) // import model
// })

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db)
//   }
// })

//https://github.com/sequelize/sequelize/issues/7934

const models = [
  require("./user")(sequelize, Sequelize),
  require("./assignment")(sequelize, Sequelize),
  require("./patient")(sequelize, Sequelize),
  require("./visit")(sequelize, Sequelize),
  require("./charge")(sequelize, Sequelize),
  require("./patientplan")(sequelize, Sequelize),
  require("./payment")(sequelize, Sequelize),
  require("./plancoverage")(sequelize, Sequelize),
  require("./insuranceplan")(sequelize, Sequelize),
];
models.forEach((model) => {
  db[model.name] = model;
});

models.forEach((model) => {
  if (db[model.name].associate) {
    db[model.name].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
