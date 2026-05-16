const https = require('https');
const path = require('path');
const fs = require('fs');
const {URL} = require('url');
require('dotenv').config();

const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
    // Enable all security features
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.3',
    // Recommended security settings
    ciphers: [
        'TLS_AES_256_GCM_SHA384',
        'TLS_CHACHA20_POLY1305_SHA256',
        'TLS_AES_128_GCM_SHA256',
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-ECDSA-CHACHA20-POLY1305',
        'ECDHE-RSA-CHACHA20-POLY1305',
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES128-GCM-SHA256'   
    ].join(':'),
    honorCipherOrder: true,
    

    secureOptions: require('constants').SSL_OP_NO_SSLv3 |
            require('constants').SSL_OP_NO_TLSv1 |
            require('constants').SSL_OP_NO_TLSv1_1
};

const api_key = process.env.API_KEY;
const port = process.env.API_PORT;
const host = process.env.HOST;

const server = https.createServer(sslOptions, async (req,res)=>{

    const securityHeaders = {
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Content-Security-Policy': "default-src 'self'; connect-src 'self' https://api.weatherapi.com",
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Access-Control-Allow-Origin': `https://${host}:${process.env.STATIC_PORT}`,
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    const {method , url} = req;
    const parsedUrl = new URL(url, `https://${req.headers.host}`);
    const pathname = parsedUrl.pathname; 
    if (method === 'OPTIONS'){
        res.writeHead(200);
        res.end();
        return;
    }

    if (method === 'GET'){
        try{
            const location = parsedUrl.searchParams.get('q');
            const url = `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${location}&days=5&aqi=no&alerts=no`;
            const response = await fetch(url);
            const data = await response.json();
            res.writeHead(200,{'Content-Type': 'application/json'});
            res.end(JSON.stringify(data));
        }
        catch{
            res.writeHead(404,{'Content-Type': 'application/json'});
            res.end(JSON.stringify({error:'Not found'}));
        }
    }
});


// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  // Perform graceful shutdown
  server.close(() => process.exit(1));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });

  // Force close server after 10 seconds
  setTimeout(() => {
    console.error('Forcing shutdown...');
    process.exit(1);
  }, 10000);
};

// Listen for shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);


server.listen(port, host, ()=>{
  console.log(`Server running at https://${host}:${port}`);
});
