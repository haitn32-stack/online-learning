const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads directory static serving
app.use('/uploads', express.static('uploads'));

// Mount all routes
const mountRoutes = require('./routes');
mountRoutes(app);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
