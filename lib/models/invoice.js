var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function daysFromToday(days = 0) {
  var today = Date.now()
  return today + (days * 24*60*60*1000)
}

var lineSchema = new Schema({
  name : String,
  price : Number
});

const tax_codes = {
  "0": {
    "percentage": 0, // 10% = 10 / 100 => 0.10 (then 100 * 0.10 = 10)
  },
  "13": {
    "percentage": 0.13,
  },
  "15": {
    "percentage": 0.15,
  }
}

var invoiceSchema = Schema({
  number: {
    type: String,
    unique: true,
    required: true
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'clients',
    default: null
  },
  invoice_date: {
    type : Date,
    default: Date.now
  },
  payment_due: {
    type : Date,
    default: daysFromToday(45) // default to 45 days from today
  },
  amount_due: {
    type: Number,
    default: 0
  },
  tax_code: {
    type: String,
    enum: ['0', '13', '15'],
    default: '0'
  },
  lines: [
    lineSchema
  ],
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

invoiceSchema.virtual('calculate_tax').get(function() {
  const amount = this.amount_due
  const percentage = tax_codes(this.tax_code).percentage
  return (this.amount_due * percentage)
});

module.exports = mongoose.model('invoices', invoiceSchema);
