/**
 * Root Router and Redirections to Routers
 */

import express from 'express';
import { LogInfo } from '../utils/logger.js';
import authRouter from './authRouter.js';
import userRouter from './userRouter.js';

const server = express();

const rootRouter = express.Router();

rootRouter.get('/', (req, res) => {
  LogInfo('GET: http://localhost:8000/api/');
  res.send('Welcome to my API Restful');
});

// Redirections to Routers & Controllers
server.use('/', rootRouter) // http://localhost:8000/api/ --> Root
server.use('/auth', authRouter) // http://localhost:8000/api/auth --> Auth
server.use('/user', userRouter) // http://localhost:8000/api/user --> User

export default server