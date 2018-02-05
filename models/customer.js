'use strict';
module.exports = (sequelize, DataTypes) => {
  var Customer = sequelize.define('Customer', {
    nombre_completo: DataTypes.STRING,
    rut: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 30000000
      }
    }
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
