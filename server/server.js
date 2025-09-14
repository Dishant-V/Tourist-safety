import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import cron from 'node-cron';

// Import routes
import authRoutes from './routes/auth.js';
import emergencyRoutes from './routes/emergency.js';
import culturalRoutes from './routes/cultural.js';
import geofencingRoutes from './routes/geofencing.js';
import blockchainRoutes from './routes/blockchain.js';
import dashboardRoutes from './routes/dashboard.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Import services
import { EmergencyService } from './services/emergencyService.js';
import { GeofencingService } from './services/geofencingService.js';
import { BlockchainService } from './services/blockchainService.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'NE Tourist Safety Backend',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/cultural', culturalRoutes);
app.use('/api/geofencing', geofencingRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection established');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'EMERGENCY_ALERT':
          await EmergencyService.handleEmergencyAlert(data.payload, ws);
          break;
        case 'LOCATION_UPDATE':
          await GeofencingService.updateLocation(data.payload, ws);
          break;
        case 'HEARTBEAT':
          ws.send(JSON.stringify({ type: 'HEARTBEAT_ACK', timestamp: Date.now() }));
          break;
        default:
          ws.send(JSON.stringify({ type: 'ERROR', message: 'Unknown message type' }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Scheduled tasks
cron.schedule('0 */6 * * *', () => {
  console.log('Running scheduled safety zone updates...');
  GeofencingService.updateSafetyZones();
});

cron.schedule('0 0 * * *', () => {
  console.log('Running daily blockchain sync...');
  BlockchainService.syncDailyTransactions();
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 NE Tourist Safety Backend running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for real-time connections`);
  console.log(`🛡️  Security middleware active`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;