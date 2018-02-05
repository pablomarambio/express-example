'use strict';

var app      = require('../../app');
var Bluebird = require('bluebird');
var expect   = require('expect.js');
var request  = require('supertest');

describe('tenant creation page', function () {
  before(function () {
      return require('../../models').sequelize.sync();
  });
  
  beforeEach(function () {
    this.models = require('../../models');

    return Bluebird.all([
      //this.models.Task.destroy({ truncate: true, cascade: true }),
      this.models.Tenant.destroy({ truncate: true, cascade: true })
    ]);
  });

  it('loads correctly', function (done) {
    request(app).get('/').expect(200, done);
  });

  it('lists a tenant if there is one', function (done) {
    this.models.Tenant.create({ email: 'tenant@tenant.com' }).then(function () {
      request(app).get('/').expect(/tenant@tenant.com/, done);
    })
  });

  it('lists the customers for the tenant if available', function (done) {
    this.models.Tenant.create({ username: 'tenant@tenant.com' }).bind(this).then(function (user) {
      return this.models.Customer.create({ title: 'johndoe task', TenantId: user.id });
    }).then(function () {
      request(app).get('/').expect(/johndoe task/, done);
    });
  });
});
