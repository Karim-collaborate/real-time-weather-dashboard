const https= require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const port = process.env.STATIC_PORT;
const host = process.env.HOST;
const API_PORT = process.env.API_PORT;

const basePath = path.join(__dirname);
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

const server = https.createServer(sslOptions, (req,res)=>{

    const securityHeaders = {
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Content-Security-Policy': `default-src 'self'; connect-src 'self' https://localhost:${API_PORT}; style-src 'self' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com`,
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });


    const filePath = req.url ==='/' ? path.join(basePath,'weather.html') : path.join(basePath,req.url);

    if(!filePath.startsWith(basePath)){
        res.writeHead(403, {'Content-type': 'text/plain'});
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath,(err,data)=>{ 
        if (err){
            res.writeHead(404,{'Content-Type': 'text/plain'});
            res.end('not found');
        }
        else{
            const ext = path.extname(filePath).toLowerCase();
            let contentType = 'text/html';
            if (ext === '.css') {
                contentType = 'text/css';
            }
            else if (ext === '.js') {
                contentType = 'application/javascript';
            }
            else if (ext === '.png') {
                contentType = 'image/png';
            }
            else if (ext === '.jpg' || ext === '.jpeg') {
                contentType = 'image/jpeg';
            }
            // previously we change the contentType based on the extension so that the browser renders the css and js and images correctly
            res.writeHead(200,{'Content-Type': contentType});
            res.end(data);
        }
    });
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

server.listen(port, host ,() => {
  console.log(`Server running at https://${host}:${port}`);
});


