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

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TransitOps Backend API is running' });
});

app.use('/api/vehicles', vehiclesRouter);
app.use('/api/auth', authRouter);
app.use('/api/drivers', driversRouter);
app.use('/api/maintenance', maintenanceRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
