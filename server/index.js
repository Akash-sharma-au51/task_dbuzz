import fs from 'fs';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import connectDB from './config/db.config.js';
import rateLimit from 'express-rate-limit';
import errorMiddleware from './middlewares/errorMiddleware.js';

const app = express();
const envFile = fs.existsSync(path.resolve(process.cwd(), '.env'))
  ? '.env'
  : path.resolve(process.cwd(), '.envdev');
dotenv.config({ path: envFile });

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not defined. Check your .env or .envdev file.');
}

const corsoption = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
};
const port =process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors(corsoption));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

// Connect to Database and Start Server
connectDB().then(()=> {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error('Failed to connect to the database', err);
});