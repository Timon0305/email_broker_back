const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');

const CustomerSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  quantity: {
    type: String
  },
  unit: {
    type: String
  },
  passcode: {
    type: String
  },
  attachment: {
    type: String
  },
  price: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
});


/*-----------------------------------------------------------
|   Process Updates
|------------------------------------------------------------*/

CustomerSchema.pre('save', async function(next) {
  this.updatedAt = new Date(Date.now());
});

module.exports = mongoose.model('Customer', CustomerSchema);
