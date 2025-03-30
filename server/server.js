require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');   
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { protect } = require('./middleware/authMiddleware');
const io = require("socket.io")(http, { cors: { origin: "http://localhost:3000" } });

const app = express();

app.use(express.json());

io.on("connection", (socket) => {
  socket.on("newTask", (task) => {
    io.emit("taskAdded", task);
  });
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
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


app.use('/api/auth', authRoutes);

app.use('/api/tasks', taskRoutes);

app.get('/api/profile', protect, (req, res) => {
    res.json({ user: req.user });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  });

