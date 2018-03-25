var express = require('express');
var router = express.Router();
var logController = require('./controller');

router.get('/', logController.findAll);

router.get('/:id', logController.findById);

router.post('/', logController.create);

router.put('/id/:id', logController.update);

router.delete('/:id', logController.delete);

module.exports = router;
