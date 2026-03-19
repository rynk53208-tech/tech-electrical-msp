/**
 * Simple Node.js server for lead capture
 * Run with: node server.js
 * Then open http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// Store leads in memory (in production, use a database)
let leads = [];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Serve index.html
    if (pathname === '/' || pathname === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading page');
                return;
            }
            res.end(data);
        });
        return;
    }

    // API: Submit lead
    if (pathname === '/api/leads' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const leadData = JSON.parse(body);
                leadData.id = Date.now();
                leadData.timestamp = new Date().toISOString();
                leads.push(leadData);

                // Log lead to console
                console.log('📬 New Lead Received:');
                console.log(`  Name: ${leadData.name}`);
                console.log(`  Email: ${leadData.email}`);
                console.log(`  Phone: ${leadData.phone}`);
                console.log(`  Service: ${leadData.service}`);
                console.log(`  Message: ${leadData.message}`);
                console.log('---');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, id: leadData.id }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid data' }));
            }
        });
        return;
    }

    // API: Get all leads (admin view)
    if (pathname === '/api/leads' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(leads, null, 2));
        return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`🚀 Lead Gen Server running at http://localhost:${PORT}`);
    console.log(`📧 Submit leads at: http://localhost:${PORT}/api/leads`);
    console.log(`📊 View leads at: http://localhost:${PORT}/api/leads (GET)`);
});
