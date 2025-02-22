import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';


dotenv.config();
const app = express();

// Set default port if not defined in .env
const PORT = process.env.PORT 

// Middleware to parse JSON (should be before routes)
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Root route to confirm server is running
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Click to open: http://localhost:${PORT}`);
    connectDB();
});
