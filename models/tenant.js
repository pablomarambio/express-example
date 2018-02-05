'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tenant = sequelize.define('Tenant', {
    email: DataTypes.STRING
  });

  Tenant.associate = function(models) {
    models.Tenant.hasMany(models.Customer);
  };

  return Tenant;
};
