'use strict';

var app      = require('../../app');
var Bluebird = require('bluebird');
var expect   = require('expect.js');
var request  = require('supertest');

describe('app', function () {
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
  describe('web frontend', function () {

    it('loads correctly', function (done) {
      request(app).get('/').expect(200, done);
    });

    it('lists a tenant if there is one', function (done) {
      this.models.Tenant.create({ email: 'tenant@tenant.com' }).then(function () {
        request(app).get('/').expect(/tenant@tenant.com/, done);
      })
    });

    it('lists the customers for the tenant at index', function (done) {
      var tenantId;
      this.models.Tenant.create({ username: 'tenant@tenant.com' }).bind(this)
      .then(function (tenant) {
        tenantId = tenant.id;
        this.models.Customer.create({ nombre_completo: 'johndoe task', TenantId: tenantId });
      }).then(function () {
        request(app).get('/').expect(/johndoe task/, done);
      });
    });

    it('lists the customers for the tenant at api', function (done) {
      var tenantId;
      this.models.Tenant.create({ email: 'tenant@tenant.com' }).bind(this)
      .then(function (tenant) {
        tenantId = tenant.id;
        this.models.Customer.create({ nombre_completo: 'johndoe', TenantId: tenantId });
      }).then(function () {
        request(app).get('/tenants/' + tenantId + "/customers").expect(/johndoe/, done);
      });
    });

  });

  describe("api", function () {

    it('lists the customers for the tenant', function (done) {
      var tenantId;
      this.models.Tenant.create({ username: 'tenant@tenant.com' }).bind(this)
      .then(function (tenant) {
        tenantId = tenant.id;
        this.models.Customer.create({ nombre_completo: 'bea', rut: 7956772, TenantId: tenantId });
      }).then(function () {
        request(app).get('/tenants/' + tenantId + "/customers").expect(/bea/, done);
      });
    });

    it('returns 404 when trying to list the customers from an unknown tenant', function (done) {
      var tenantId = 234234234;
      request(app).get('/tenants/' + tenantId + "/customers").expect(404, done);
    });


    it('creates a customer', function (done) {
      var tenantId;
      this.models.Tenant.create({ email: 'tenant@tenant.com' }).bind(this)
      .then(function (tenant) {
        tenantId = tenant.id;
        request(app)
          .post('/tenants/' + tenantId + "/customers")
          .send({nombre_completo: "Pepito", rut: 15776844})
          .expect(302, done)
      });
    });

    it('forbids a duplicated customer rut for the same tenant', function (done) {
      var tenantId;
      this.models.Tenant.create({ email: 'tenant@tenant.com' }).bind(this)
      .then(function (tenant) {
        tenantId = tenant.id;
        request(app)
          .post('/tenants/' + tenantId + "/customers")
          .send({nombre_completo: "Pepito", rut: 14569484})
          .then(function() {
            request(app)
              .post('/tenants/' + tenantId + "/customers")
              .send({nombre_completo: "Pepito 2", rut: 14569484})
              .expect(403, done)
          });
      });
    });
  });
});
