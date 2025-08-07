// Production Configuration
export const productionConfig = {
  // API Configuration
  API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:8080/api/risk',
  
  // Firebase Configuration
  FIREBASE_CONFIG: {
    apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDq4UeHyhxoeSpWrZBwvYEjQAdrwnFPgnk",
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "predictive-risk-scoring.firebaseapp.com",
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "predictive-risk-scoring",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "predictive-risk-scoring.appspot.com",
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
  },
  
  // Gemini AI Configuration
  GEMINI_API_KEY: process.env.VITE_GEMINI_API_KEY || "AIzaSyDq4UeHyhxoeSpWrZBwvYEjQAdrwnFPgnk",
  
  // Clerk Authentication
  CLERK_PUBLISHABLE_KEY: process.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_your-clerk-key",
  
  // Application Settings
  APP_NAME: "Predictive Risk Scoring",
  APP_VERSION: "1.0.0",
  
  // Feature Flags
  ENABLE_AI_RECOMMENDATIONS: true,
  ENABLE_REAL_TIME_MONITORING: true,
  ENABLE_ANALYTICS: true,
  
  // Performance Settings
  API_TIMEOUT: 30000,
  REFRESH_INTERVAL: 30000,
  CACHE_DURATION: 300000,
  
  // Security Settings
  MAX_RETRY_ATTEMPTS: 3,
  RATE_LIMIT_DELAY: 1000,
  
  // Logging
  LOG_LEVEL: "info",
  ENABLE_DEBUG_LOGS: false
};

export default productionConfig; 