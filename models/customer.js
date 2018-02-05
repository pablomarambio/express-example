'use strict';
module.exports = (sequelize, DataTypes) => {
  var Customer = sequelize.define('Customer', {
    nombre_completo: DataTypes.STRING,
    rut: DataTypes.INTEGER
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
