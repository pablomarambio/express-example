'use strict';

var expect = require('expect.js');

describe('models/customer', function () {
  before(function () {
      return require('../../models').sequelize.sync();
  });

  beforeEach(function () {
    this.Tenant = require('../../models').Tenant;
    this.Customer = require('../../models').Customer;
  });

  describe('create', function () {
    it('creates a customer', function () {
      return this.Tenant.create({ email: 'tenant@tenant.com' }).bind(this).then(function (tenant) {
        return this.Customer.create({ nombre_completo: 'Pepito', TenantId: tenant.id }).then(function (customer) {
          expect(customer.nombre_completo).to.equal('Pepito');
        });
      });
    });
  });
});
