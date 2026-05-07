const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const meetingRoutes = require('./routes/meetingRoutes');
const actionRoutes = require('./routes/actionRoutes');

dotenv.config();
    
const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

app.use('/meetings', meetingRoutes);
app.use('/actions', actionRoutes);

app.get('/', (req, res) => {
    res.send('Meeting Notes API is running...');
});

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

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
