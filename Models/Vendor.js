const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    creatorId: {
        type: String,
    },
    vendorPasscode: {
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

VendorSchema.pre('save', async function(next) {
    this.updatedAt = new Date(Date.now());
});

module.exports = mongoose.model('Vendor', VendorSchema);
