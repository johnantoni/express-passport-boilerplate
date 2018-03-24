var express = require('express');
var router = express.Router();
var invoiceController = require('./controller');

router.get('/', invoiceController.findAll);

router.get('/:id', invoiceController.findById);

router.post('/', invoiceController.create);

router.put('/id/:id', invoiceController.update);

router.delete('/:id', invoiceController.delete);

module.exports = router;
