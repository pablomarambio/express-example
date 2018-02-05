var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.post('/create', function(req, res) {
  models.Tenant.create({
    email: req.body.email
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:Tenant_id/destroy', function(req, res) {
  models.Tenant.destroy({
    where: {
      id: req.params.Tenant_id
    }
  }).then(function() {
    res.redirect('/');
  });
});

router.get('/:Tenant_id/customers', function(req, res) {
  models.Tenant.find({ 
    where: { id: req.params.Tenant_id }, 
    include: [ models.Customer ]
  }).then(function(tenant) {
    res.send(tenant.Customers);
  });
});

router.post('/:Tenant_id/customers', function (req, res) {
  models.Customer.find({where: { TenantId: req.params.Tenant_id, rut: req.body.rut }}).then(existing => {
    if(existing) { 
      return res.status(403).send("RUT " + req.body.rut + " ya existe para tenant " + req.params.Tenant_id);
    }
    else {
      models.Customer.create({
        nombre_completo: req.body.nombre_completo,
        rut: req.body.rut,
        TenantId: req.params.Tenant_id
      }).then(function() {
        res.redirect('/');
      });
    }
  });
});

router.get('/:Tenant_id/customers/:Customer_id/destroy', function (req, res) {
  models.Customer.destroy({
    where: {
      id: req.params.Customer_id
    }
  }).then(function() {
    res.redirect('/');
  });
});


module.exports = router;
