var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientSchema = Schema({
  company: {
    type: String,
    default: ''
  },
  first_name: {
    type: String,
    default: ''
  },
  last_name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  telephone: {
    type: String,
    default: ''
  },
  address_1: {
    type: String,
    default: ''
  },
  address_2: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
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

clientSchema.virtual('full_name').get(function() {
  return (this.first_name + ' ' + this.last_name)
});

module.exports = mongoose.model('clients', clientSchema);
