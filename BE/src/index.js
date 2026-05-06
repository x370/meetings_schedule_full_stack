const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const meetingRoutes = require('./routes/meetingRoutes');
const actionRoutes = require('./routes/actionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/meetings', meetingRoutes);
app.use('/actions', actionRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Meeting Notes API is running...');
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`👉 API is available at http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Error: Port ${PORT} is already in use. Please close the other process or use a different port.`);
    } else {
        console.error('❌ Server Error:', err);
    }
    process.exit(1);
});

// Prevent immediate exit
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
