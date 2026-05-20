import 'dotenv/config';
import { createServer } from 'http';
import app from './app.js';
import { connectDB } from './db/connect.js';
import { initializeSocket } from './socket/index.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Create HTTP Server
    const httpServer = createServer(app);

    // Initialize WebSockets
    initializeSocket(httpServer);

    // Start listening
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
