var invoice = require('../../models/invoice.js');

exports.findAll = function(req, res) {
  try {
    invoice
      .find({})
      .sort([['invoice_date', 'desc']])
      .populate('client')
      .populate('created_by')
      .then((records) => {
        res.send(records)
      })
  } catch (err) {
    console.log(err)
    res.send(404)
  }
}

exports.findById = function(req, res) {
  try {
    const { id } = req.params.id
    invoice
      .findOne({ '_id': id })
      .populate('client')
      .populate('created_by')
      .then((record) => {
        res.send(record)
      })
  } catch (err) {
    console.log(err)
    res.send(404)
  }
}

exports.create = function(req, res) {
  var record = new invoice();
  record.number = req.body.number;
  record.client = req.body.client;
  record.tax_code = req.body.tax_code;
  record.lines = req.body.lines
  record.created_by = null
  record.save()
  .then(function(record) {
    res.send(record);
  }).catch(function(err) {
    res.status(422)
    res.send(err);
  });
}

exports.update = function(req, res) {
  const { id } = req.params.id
  invoice.findById(id, function(err, record) {
    record.number = req.body.number;
    record.client = req.body.client;
    record.tax_code = req.body.tax_code;
    record.lines = req.body.lines
    record.created_by = null
    record.save()
    .then(function(record) {
      res.send(record);
    }).catch(function(err) {
      res.status(422)
      res.send(err);
    })
  });
};

exports.delete = function(req, res) {
  const { id } = req.params.id
  invoice.findById(id).remove()
  .then(() => res.sendStatus(200))
  .catch((err) => res.send(404));
}
