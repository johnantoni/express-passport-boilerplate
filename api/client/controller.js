var client = require('../../models/client.js');

exports.findAll = function(req, res) {
  try {
    client
      .find({})
      .sort([['created_at', 'desc']])
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
    client
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
  var record = new client();
  record.company = req.body.company;
  record.first_name = req.body.first_name;
  record.last_name = req.body.last_name;
  record.email = req.body.email;
  record.telephone = req.body.telephone;
  record.address_1 = req.body.address_1;
  record.address_2 = req.body.address_2;
  record.city = req.body.city;
  record.state = req.body.state;
  record.country = req.body.country;
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
  client.findById(id, function(err, record) {
    record.company = req.body.company;
    record.first_name = req.body.first_name;
    record.last_name = req.body.last_name;
    record.email = req.body.email;
    record.telephone = req.body.telephone;
    record.address_1 = req.body.address_1;
    record.address_2 = req.body.address_2;
    record.city = req.body.city;
    record.state = req.body.state;
    record.country = req.body.country;
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
  client.findById(id).remove()
  .then(() => res.sendStatus(200))
  .catch((err) => res.send(404));
}
