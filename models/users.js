var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var userSchema = Schema({
  username: {
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

// userSchema.plugin(passportLocalMongoose, {
//   selectFields: 'username first_name last_name'
// });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', userSchema);
