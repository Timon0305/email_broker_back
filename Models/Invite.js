const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema({
    creator: {
        type: String,
    },
    vendor: {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
});

InviteSchema.pre('save', async function(next) {
    this.updatedAt = new Date(Date.now());
});

module.exports = mongoose.model('Invite', InviteSchema);