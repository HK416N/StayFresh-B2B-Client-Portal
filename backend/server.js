import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';

// Database & Middleware 
// import { verifyToken } from './middleware/verifyToken.js';

// Routers
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js'; // Import the new product routes

const app = express();
const PORT = 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// server health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// routes go here
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Use the new product routes

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
