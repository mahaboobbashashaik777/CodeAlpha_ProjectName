const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const { config } = require('./config/translation');
const translateRoutes = require('./routes/translateRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const logger = require('./config/logger');

// Initialize App
const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP for Swagger UI to load resources correctly
}));

// CORS Middleware
app.use(cors({
  origin: config.clientUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging HTTP Requests
const morganStream = {
  write: (message) => logger.info(message.trim())
};
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: morganStream }));

// Swagger API Documentation Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AuraTranslate API Documentation',
      version: '1.0.0',
      description: 'API for translating text with support for Google, Microsoft, and public fallback APIs.',
      contact: {
        name: 'Developer Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Local development server',
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.js')], // Paths to files with Swagger annotations
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Mount Routes (Mount both prefix and root endpoints to satisfy any format)
app.use('/api', translateRoutes);
app.use('/', translateRoutes); // Allows POST /translate directly

// Redirect empty root to swagger docs or home page info
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>AuraTranslate Server</title>
        <style>
          body { font-family: system-ui, sans-serif; text-align: center; padding: 4rem; background: #0f172a; color: #f8fafc; }
          a { color: #6366f1; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .card { background: #1e293b; padding: 2rem; border-radius: 1rem; display: inline-block; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🔮 AuraTranslate Backend Service</h1>
          <p>The translation service is running successfully.</p>
          <p>Explore the <a href="/api-docs">Interactive API Swagger Documentation</a>.</p>
        </div>
      </body>
    </html>
  `);
});

// Error handling middleware
app.use(errorHandler);

// Start Server
const server = app.listen(config.port, () => {
  logger.info(`Server started in ${config.nodeEnv} mode on port ${config.port}`);
  logger.info(`Swagger API documentation available at http://localhost:${config.port}/api-docs`);
});

module.exports = server; // Export for testing
