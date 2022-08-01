import dotenv from 'dotenv';
import app from './src/server/index.js';
import { LogSuccess, LogError } from './src/utils/logger.js'

// Configuration the .env file
dotenv.config();

const port = process.env.PORT || 8000;

// Execute APP and Listen Requests to PORT
app.listen(port, () => {
  LogSuccess(`EXPRESS SERVER: Running at http://localhost:${port}/api`);
});

// Control SERVER ERROR
app.on('error', (error) => {
  LogError(`[SERVER ERROR]: ${error}`);
});