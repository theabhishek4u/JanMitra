// Entrypoint for Vercel deployment when Root Directory is set to repository root
const express = require('express');

let app;
try {
  // If server is built, use the compiled server application
  const serverModule = require('./server/dist/index.js');
  app = serverModule.default || serverModule;
} catch (e) {
  // Fallback express application if dist is not yet available
  app = express();
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'Jansunwai AI (जनसुनवाई) Root Service',
      timestamp: new Date().toISOString()
    });
  });

  app.all('*', (req, res) => {
    res.status(200).json({
      name: 'Jansunwai AI (जनसुनवाई)',
      status: 'online',
      message: 'Jansunwai AI platform root deployment is running.',
      routes: {
        frontend: 'Client workspace Next.js app',
        backend: '/api and Server workspace Express app'
      }
    });
  });
}

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Jansunwai AI root entrypoint listening on port ${PORT}`);
  });
}

module.exports = app;
