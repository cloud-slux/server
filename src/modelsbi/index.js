const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config');
const db = {};

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
);

const dirFinancial = __dirname + '/financial';
const dirManagement = __dirname + '/management';

const dirs = [ dirFinancial, dirManagement ];


function iterateDir(dirName) {
  fs.readdirSync(dirName)
  .filter(file => file !== 'index.js')
  .forEach(file => {
    const model = sequelize.import(path.join(dirName, file));
    db[model.name] = model;
  });
};

dirs.forEach(iterateDir);

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
