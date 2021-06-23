const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    passcode: {
        type: String
    },
    quantity: {
        type: String
    },
    unit: {
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

ItemSchema.pre('save', async function(next) {
    this.updatedAt = new Date(Date.now());
});

module.exports = mongoose.model('Item', ItemSchema);
