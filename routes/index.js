var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  models.Tenant.findAll({
    include: [ models.Customer ]
  }).then(function(tenants) {
    res.render('index', {
      titulo: 'Sequelize: Express Example',
      tenants: tenants
    });
  });
});

module.exports = router;
