var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = Schema({
  time: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    default: ''
  },
  invoice: {
    type: Schema.Types.ObjectId,
    ref: 'invoices',
    default: null
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'clients',
    default: null
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    default: null
  }
},
{
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  },
  timestamps: true
});

module.exports = mongoose.model('logs', logSchema);
