var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var userSchema = Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  first_name: {
    type: String,
    default: ''
  },
  last_name: {
    type: String,
    default: ''
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

userSchema.virtual('full_name').get(function() {
  return (this.first_name + ' ' + this.last_name)
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model('users', userSchema);
