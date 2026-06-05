const express = require('express');
const cors = require('cors');
const schoolRoutes = require('./routes/schoolRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Base route for health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the School Management API',
    status: 'Healthy',
  });
});

// Register school API routes at the root
app.use('/', schoolRoutes);

// Catch-all route handler for 404 Not Found
app.use((req, res, next) => {
  const error = new Error('Resource not found');
  error.status = 404;
  next(error);
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
