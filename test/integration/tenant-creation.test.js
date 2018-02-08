'use strict';

var app      = require('../../app');
var Bluebird = require('bluebird');
var expect   = require('expect.js');
var request  = require('supertest');

describe('global', () => {

  before(function () {
      return require('../../models').sequelize.sync();
  });
  
  beforeEach(function (done) {
    this.models = require('../../models');
    this.models.Tenant.create({ email: 'tenant@tenant.com' }).then((newTenant) => {
      this.tenant = newTenant;
      done();
    });
  });

  afterEach(function(done) {
    this.models.Tenant.destroy({ truncate: true, cascade: true });
    done();
  });

  describe('app', function () {

    describe('web frontend', function () {

      describe('/setup', function () {

        it('loads correctly', function (done) {
          request(app).get('/setup').expect(200, done);
        });

        it('lists a tenant if there is one', function (done) {
          request(app).get('/setup').expect(/tenant@tenant.com/, done);
        });

      });

      describe('/tenant-view', function () {

        it('loads correctly', function (done) {
          request(app).get('/tenant-view/' + this.tenant.id).expect(200, done);
        });

        it('lists the customers for the tenant', function (done) {
          var tenantId = this.tenant.id;
          this.models.Customer
            .create({ nombre_completo: 'juan', rut: 8457638, TenantId: tenantId })
            .then(function () {
              request(app).get('/tenant-view/' + tenantId).expect(/juan/, done);
            });
        });

      });
    });

    describe("api", function () {

      describe("customers", () => {

        describe("list", () => {

          it('lists the customers for the tenant', function (done) {
            var tenantId = this.tenant.id;
              this.models.Customer
              .create({ nombre_completo: 'bea', rut: 7956772, TenantId: tenantId })
              .then(function () {
                request(app).get('/tenants/' + tenantId + "/customers").expect(/bea/, done);
              });
          });

          it('returns 404 when trying to list the customers from an unknown tenant', function (done) {
            var tenantId = 234234234;
            request(app).get('/tenants/' + tenantId + "/customers").expect(404, done);
          });

        });

        describe("create", () => {

          it("works with x-www-urlencoded", function(done) {
            var tenantId;
            tenantId = this.tenant.id;
            request(app)
              .post('/tenants/' + tenantId + "/customers")
              .send({nombre_completo: "Pepito", rut: 15776844})
              .expect(302, done);
          });

          it('works with JSON', function (done) {
            var tenantId = this.tenant.id;
            request(app)
              .post('/tenants/' + tenantId + "/customers")
              .send({nombre_completo: "Pepito", rut: 15776844})
              .expect(302, done);
          });

          it('forbids a duplicated customer rut for the same tenant', function (done) {
            var tenantId = this.tenant.id;
            request(app)
              .post('/tenants/' + tenantId + "/customers")
              .send({nombre_completo: "Pepito", rut: 14569484})
              .then(function() {
                request(app)
                  .post('/tenants/' + tenantId + "/customers")
                  .send({nombre_completo: "Pepito 2", rut: 14569484})
                  .expect(403, done);
              });
          });
          
        });
        
      });
    });
  });

});
