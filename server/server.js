require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server }  = require("socket.io");
const cors = require('cors');
const mongoose = require('mongoose');   
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { protect } = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});


io.on("connection", (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on("newTask", (task) => {
    console.log('New task received:', task);
    io.emit("taskAdded", task);
  });

  socket.on("disconnect", () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/tasks', taskRoutes);

app.get('/api/profile', protect, (req, res) => {
    res.json({ user: req.user });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port:${PORT}`);
      console.log(`Test endpoints:`);
      console.log(`- POST   http://localhost:${PORT}/api/auth/register`);
      console.log(`- POST   http://localhost:${PORT}/api/auth/login`);
      console.log(`- GET    http://localhost:${PORT}/api/profile (protected)`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });




app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  });

