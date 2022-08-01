import express from 'express';

// Security
import cors from 'cors';
import helmet from 'helmet';

// Root Router
import rootRouter from '../routes/index.js';
import mongoose from 'mongoose';

// Create Express App
const app = express();

// Define server to use '/api' and use rootRouter from index.js in routes
app.use('/api', rootRouter);

// Mongoose Connection
// TODO: Conectar a servidor de mongodb online y no local
mongoose.connect('mongodb://localhost:27017/finance');

// Security config
app.use(cors());
app.use(helmet());

// Content Type Config
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Redirection Config: http://localhost:8000/ --> http://localhost:8000/api/
app.get('/', (req, res) => {
  res.redirect('/api');
});

export default app