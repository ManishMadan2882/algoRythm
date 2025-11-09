const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api/v1/compile', require('./routes/compileRoute'));

app.get('/status', (req, res) => {
  res.json({ msg: "working fine" })
})

// Create HTTP server for socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handler
const { handleCompileSocket } = require('./controllers/compileCodeSocket');
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  handleCompileSocket(socket);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});
 */
server.listen(port, () => {
  console.log('Server running at port ' + port);
});