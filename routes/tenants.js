var models  = require('../models');
var express = require('express');
var router  = express.Router();
var Sequelize = require('sequelize');

router.post('/create', function(req, res) {
  models.Tenant.create({
    email: req.body.email
  }).then(function() {
    res.redirect('/setup');
  });
});

router.get('/:Tenant_id/destroy', function(req, res) {
  models.Tenant.destroy({
    where: {
      id: req.params.Tenant_id
    }
  }).then(function() {
    res.redirect('/setup');
  });
});

router.get('/:Tenant_id/customers', function(req, res) {
  models.Tenant.find({ 
    where: { id: req.params.Tenant_id }, 
    include: [ models.Customer ]
  }).then(function(tenant) {
    if(!tenant) {return res.status(404).send("Tenant no encontrado");}
    res.send(tenant.Customers);
  });
});

router.post('/:Tenant_id/customers', function (req, res) {
  models.Customer
    .find({where: { TenantId: req.params.Tenant_id, rut: req.body.rut }})
    .then(existing => {
      if(existing) { 
        if(req.query.return_to_tenant_view) { 
          var errMsg = "Error: el RUT ya existe para este tenant";
          console.log(errMsg);
          req.flash('error', errMsg);
          return res.redirect("/tenant-view/" + req.params.Tenant_id); 
        } else {
          return res.status(403).send("RUT " + req.body.rut + " ya existe para tenant " + req.params.Tenant_id);
        }
      }
      else {
        models.Customer.create({
          nombre_completo: req.body.nombre_completo,
          rut: req.body.rut,
          TenantId: req.params.Tenant_id
        }).then((cust) => {
          if(req.query.return_to_tenant_view) { return res.redirect("/tenant-view/" + req.params.Tenant_id); }
          res.redirect('/' + req.params.Tenant_id + "/customers");
        });
      }
    })
    .catch((err) => {
      var errMsg = "Error: " + err.name + "; " + err.message;
      console.log(errMsg);
      req.flash('error', errMsg);
      if(req.query.return_to_tenant_view) { return res.redirect("/tenant-view/" + req.params.Tenant_id); }
      res.redirect('/' + req.params.Tenant_id + "/customers");
    });
});

router.get('/:Tenant_id/customers/:Customer_id/destroy', function (req, res) {
  models.Customer.destroy({
    where: {
      id: req.params.Customer_id
    }
  }).then(function() {
    if(req.query.return_to_tenant_view) { return res.redirect("/tenant-view/" + req.params.Tenant_id); }
    res.redirect('/tenants/' + req.params.Tenant_id + "/customers");
  });
});

module.exports = router;
