import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io-client';

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle events from the client
  socket.on('chat message', (msg) => {
    console.log('Message:', msg);
    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
