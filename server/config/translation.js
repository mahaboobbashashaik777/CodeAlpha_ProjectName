const { TranslationServiceClient } = require('@google-cloud/translate');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' }); // Load env variables from root

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  preferredApi: process.env.PREFERRED_API || 'fallback', // 'google', 'microsoft', 'fallback'
  
  google: {
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  },
  
  microsoft: {
    key: process.env.MICROSOFT_TRANSLATOR_KEY,
    region: process.env.MICROSOFT_TRANSLATOR_REGION || 'global',
    endpoint: 'https://api.cognitive.microsofttranslator.com',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 mins
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100
  }
};

// Initialize Google Translation client if credentials exist
let googleTranslateClient = null;
if (config.google.projectId && config.google.credentialsPath) {
  try {
    googleTranslateClient = new TranslationServiceClient();
  } catch (error) {
    console.error('Failed to initialize Google Translation Service Client:', error.message);
  }
}

module.exports = {
  config,
  googleTranslateClient
};
