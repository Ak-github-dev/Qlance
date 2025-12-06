import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'Backend is running! ✅',
    timestamp: new Date().toISOString(),
    qubicRPC: process.env.QUBIC_RPC_URL || 'Not configured yet',
  });
});

// Simple API endpoint
app.get('/api/info', (req: Request, res: Response) => {
  res.json({
    project: 'Qlance - Qubic Micro-Freelance Marketplace',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
