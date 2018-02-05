'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.js')[env];
var db        = {};


//var sequelize = new Sequelize('postgres://localhost:5432/customerdb2_development');
//console.log(process.env);
if (process.env.NODE_ENV == "production") {
  var sequelize = new Sequelize("postgres://imbrnhuwhpwrxv:57c92dbef266684531bb9701a01c3d0652713101bc9cd55406f32921c3dfd5ed@ec2-54-197-253-122.compute-1.amazonaws.com:5432/d29q60huol2cdf");
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}
sequelize
  .authenticate()
  .then(() => {
    //console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
