const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
    customerId: {
        type: String,
    },
    vendorId: {
        type: String,
    },
    price: {
        type: Number,
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
});

QuoteSchema.pre('save', async function(next) {
    this.updatedAt = new Date(Date.now());
});

module.exports = mongoose.model('Quote', QuoteSchema);