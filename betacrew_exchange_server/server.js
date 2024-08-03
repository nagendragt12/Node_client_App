const net = require('net');

const server = net.createServer((socket) => {
    console.log('Client connected');

    // Simulate sending packets every second
    let sequence = 1;
    const interval = setInterval(() => {
        const packet = Buffer.alloc(17);
        packet.write('AAPL', 0, 'ascii'); // Symbol
        packet.writeUInt8(1, 4); // Buy/Sell Indicator (1 for Buy)
        packet.writeUInt32BE(100, 5); // Quantity
        packet.writeUInt32BE(15000, 9); // Price
        packet.writeUInt32BE(sequence++, 13); // Sequence number

        socket.write(packet);
    }, 1000);

    socket.on('end', () => {
        clearInterval(interval);
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});