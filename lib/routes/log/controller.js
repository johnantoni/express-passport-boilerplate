var log = require('../../models/log.js');

exports.findAll = function(req, res) {
  try {
    log
      .find({})
      .sort([['created_at', 'desc']])
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
    log
      .findOne({ '_id': id })
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
  var record = new log();
  record.time = req.body.time;
  record.name = req.body.name;
  record.invoice = null;
  record.client = req.body.client;
  record.created_by = null;
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
  log.findById(id, function(err, record) {
    record.time = req.body.time;
    record.name = req.body.name;
    record.invoice = null;
    record.client = req.body.client;
    record.created_by = null;
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
  log.findById(id).remove()
  .then(() => res.sendStatus(200))
  .catch((err) => res.send(404));
}
