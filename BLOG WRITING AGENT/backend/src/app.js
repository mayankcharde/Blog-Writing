const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Blog Writing Agent API is running...');
});

module.exports = app;
