var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  models.Tenant.findAll({
    include: [ models.Customer ]
  }).then(function(tenants) {
    res.render('index', {
      titulo: 'Editor tenants y clientes',
      tenants: tenants
    });
  });
});

router.get('/tenant-view/:id', function(req, res) {
  models.Tenant.find({
    where: {id: req.params.id },
    include: [ models.Customer ]
  }).then(function(tenant) {
    if(!tenant) {return res.status(404).send("Tenant no encontrado");}
    res.render('tenant', {
      titulo: 'Vista de un tenant',
      tenant: tenant
    });
  });
});

module.exports = router;
