import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';

export function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  // Request logger in dev
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (req.path.startsWith('/api')) {
        console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
      }
    });
    next();
  });

  // Base route
  app.get('/', (req: Request, res: Response) => {
    res.json({
      name: 'WildBuddy API Server',
      status: 'active',
      endpoints: [
        'GET /api/health',
        'POST /api/identify',
        'POST /api/generate-adventure',
        'GET /api/config',
        'POST /api/config'
      ]
    });
  });

  // API router
  app.use('/api', apiRoutes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `Endpoint not found: ${req.method} ${req.path}`
    });
  });

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  });

  return app;
}
