var express = require('express');
var router = express.Router();
var clientController = require('./controller');

router.get('/', clientController.findAll);

router.get('/:id', clientController.findById);

router.post('/', clientController.create);

router.put('/id/:id', clientController.update);

router.delete('/:id', clientController.delete);

module.exports = router;
