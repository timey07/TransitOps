import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import vehiclesRouter from './routes/vehicles';
import authRouter from './routes/auth';
import driversRouter from './routes/drivers';
import maintenanceRouter from './routes/maintenance';
import tripsRouter from './routes/trips';
import expensesRouter from './routes/expenses';
import analyticsRouter from './routes/analytics';

import { authenticateToken } from './routes/auth';

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TransitOps Backend API is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/vehicles', authenticateToken, vehiclesRouter);
app.use('/api/drivers', authenticateToken, driversRouter);
app.use('/api/maintenance', authenticateToken, maintenanceRouter);
app.use('/api/trips', authenticateToken, tripsRouter);
app.use('/api/expenses', authenticateToken, expensesRouter);
app.use('/api/analytics', authenticateToken, analyticsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
