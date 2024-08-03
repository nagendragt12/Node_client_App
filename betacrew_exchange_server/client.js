const net = require('net');
const fs = require('fs');
const mongoose = require('mongoose');
const Packet = require('./packetModel');

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/betacrew'; 
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const client = new net.Socket();
let receivedPackets = {};
let lastReceivedSeq = 0;

client.connect(3000, 'localhost', () => {
    console.log('Connected to the server');

    // Send the request to stream all packets (callType 1)
    const payload = Buffer.alloc(1, 1);
    client.write(payload);
});

client.on('data', (data) => {
    // Process the received data
    const packets = parseData(data);
    processPackets(packets);
});

client.on('end', () => {
    console.log('Disconnected from the server');
    requestMissingPackets();
});

client.on('error', (err) => {
    console.error('Error:', err);
});

function parseData(data) {
    const packets = [];
    const packetSize = 17; 
    for (let i = 0; i < data.length; i += packetSize) {
        const packet = data.slice(i, i + packetSize);
        if (packet.length < packetSize) break;

        const symbol = packet.slice(0, 4).toString('ascii').trim();
        const buySellIndicator = packet.readUInt8(4);
        const quantity = packet.readUInt32BE(5);
        const price = packet.readUInt32BE(9);
        const sequence = packet.readUInt32BE(13);

        packets.push({
            symbol,
            buySellIndicator: String.fromCharCode(buySellIndicator),
            quantity,
            price,
            sequence
        });
    }
    return packets;
}

function processPackets(packets) {
    packets.forEach(packet => {
        receivedPackets[packet.sequence] = packet;
        lastReceivedSeq = Math.max(lastReceivedSeq, packet.sequence);
        
        // Save packet to MongoDB
        const packetDoc = new Packet(packet);
        packetDoc.save()
            .then(() => console.log(`Packet ${packet.sequence} saved to MongoDB`))
            .catch(err => console.error('Error saving packet:', err));
    });

    // Check for missing sequenses
    checkForMissingSequences();
}

function checkForMissingSequences() {
    const missingSequences = [];
    for (let i = 1; i <= lastReceivedSeq; i++) {
        if (!receivedPackets[i]) {
            missingSequences.push(i);
        }
    }

    if (missingSequences.length > 0) {
        missingSequences.forEach(seq => {
            const resendPayload = Buffer.alloc(2);
            resendPayload.writeUInt8(2, 0); // Call Type 2 
            resendPayload.writeUInt8(seq, 1); // Resend Sequence
            client.write(resendPayload);
        });
    } else {
        // All sequences are received, generate JSON
        generateJSON();
    }
}

function generateJSON() {
    const output = Object.values(receivedPackets);
    fs.writeFileSync('output.json', JSON.stringify(output, null, 2));
    console.log('Output JSON file created: output.json');
}