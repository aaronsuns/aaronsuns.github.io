#!/usr/bin/env node

/**
 * PDF Generator Script
 * Generates a PDF from cv.html using Puppeteer
 */

const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Use a different port to avoid conflicts
const PORT = 8001;
const PDF_FILENAME = 'Aaron Yingcai Sun.pdf';
const HTML_FILE = 'cv.html';

// Simple HTTP server to serve the HTML file
function startServer() {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            let filePath = '.' + req.url;
            if (filePath === './') {
                filePath = './' + HTML_FILE;
            }

            const extname = String(path.extname(filePath)).toLowerCase();
            const mimeTypes = {
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.ico': 'image/x-icon'
            };

            const contentType = mimeTypes[extname] || 'application/octet-stream';

            fs.readFile(filePath, (error, content) => {
                if (error) {
                    if (error.code === 'ENOENT') {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
                    } else {
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.end(`Server Error: ${error.code}`, 'utf-8');
                    }
                } else {
                    res.writeHead(200, { 
                        'Content-Type': contentType,
                        'Cache-Control': 'no-cache'
                    });
                    res.end(content, 'utf-8');
                }
            });
        });

        server.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
            resolve(server);
        });

        server.on('error', reject);
    });
}

async function generatePDF() {
    let server;
    let browser;

    try {
        console.log('Starting PDF generation...');
        
        // Check if HTML file exists
        if (!fs.existsSync(HTML_FILE)) {
            throw new Error(`HTML file not found: ${HTML_FILE}`);
        }

        // Start local server
        console.log('Starting local HTTP server...');
        server = await startServer();

        // Wait a bit for server to be ready
        await new Promise(resolve => setTimeout(resolve, 500));

        // Launch Puppeteer
        console.log('Launching browser...');
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox', 
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu'
                ]
            });
        } catch (error) {
            console.log('Trying alternative browser launch method...');
            // Try with system Chrome if available
            const possiblePaths = [
                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                '/Applications/Chromium.app/Contents/MacOS/Chromium'
            ];
            
            let executablePath = null;
            for (const path of possiblePaths) {
                if (fs.existsSync(path)) {
                    executablePath = path;
                    break;
                }
            }
            
            browser = await puppeteer.launch({
                headless: true,
                executablePath: executablePath,
                args: [
                    '--no-sandbox', 
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage'
                ]
            });
        }

        const page = await browser.newPage();

        // Navigate to the HTML file
        const url = `http://localhost:${PORT}/${HTML_FILE}`;
        console.log(`Loading page: ${url}`);
        
        try {
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 60000
            });
        } catch (error) {
            console.log('First load attempt failed, retrying with longer timeout...');
            await page.goto(url, {
                waitUntil: 'domcontentloaded',
                timeout: 60000
            });
        }

        // Wait for content to render (JavaScript needs time to load data.json)
        console.log('Waiting for content to render...');
        await page.waitForTimeout(3000);
        
        // Wait for specific elements to ensure content is loaded
        try {
            await page.waitForSelector('#name', { timeout: 10000 });
            await page.waitForSelector('#aboutContent', { timeout: 10000 });
        } catch (error) {
            console.log('Warning: Some elements may not have loaded, proceeding anyway...');
        }

        // Generate PDF with print-optimized settings
        console.log('Generating PDF...');
        await page.pdf({
            path: PDF_FILENAME,
            format: 'Letter',
            margin: {
                top: '0.35in',
                right: '0.35in',
                bottom: '0.35in',
                left: '0.35in'
            },
            printBackground: true,
            preferCSSPageSize: true,
            displayHeaderFooter: false
        });

        console.log(`✅ PDF generated successfully: ${PDF_FILENAME}`);

    } catch (error) {
        console.error('❌ Error generating PDF:', error.message);
        process.exit(1);
    } finally {
        // Cleanup
        if (browser) {
            await browser.close();
        }
        if (server) {
            server.close();
            console.log('Server closed');
        }
    }
}

// Run the script
generatePDF();
