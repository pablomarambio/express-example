'use strict';
module.exports = (sequelize, DataTypes) => {
  var Customer = sequelize.define('Customer', {
    title: DataTypes.STRING
  });

  Customer.associate = function (models) {
    models.Customer.belongsTo(models.Tenant, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Customer;
};
