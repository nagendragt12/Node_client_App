const mongoose = require('mongoose');

const packetSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    buySellIndicator: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    sequence: { type: Number, required: true, unique: true }
});

module.exports = mongoose.model('Packet', packetSchema);