import * as http from 'http';
import { Server } from 'socket.io';
import socketService from './services/socketService';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.io server\n');
});

const io = new Server(server);

io.on('connection', (socket) => {
  socketService.handleConnection(socket);
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
