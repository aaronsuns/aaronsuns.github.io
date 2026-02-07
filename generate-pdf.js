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

// Optional first arg: default | alt | alt2
const cvVersion = process.argv[2] || 'default';
const PDF_OUTPUT_DIR = cvVersion === 'alt2' ? 'pdf-alt2' : null;  // alt2 writes to its own folder
const PDF_BASENAME = cvVersion === 'alt2' ? 'Aaron-Yingcai-Sun.pdf' : cvVersion === 'alt' ? 'Aaron Yingcai Sun - Alt.pdf' : 'Aaron Yingcai Sun.pdf';
const PDF_FILENAME = PDF_OUTPUT_DIR ? path.join(PDF_OUTPUT_DIR, PDF_BASENAME) : PDF_BASENAME;
const HTML_FILE = cvVersion === 'alt2' ? 'cv2.html' : 'cv.html';
const URL_QUERY = cvVersion === 'alt' ? '?cv=alt' : '';

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
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu'
                ]
            });
        } catch (error) {
            console.log('Trying alternative browser launch method...');
            const possiblePaths = [
                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                '/Applications/Chromium.app/Contents/MacOS/Chromium'
            ];
            let executablePath = null;
            for (const p of possiblePaths) {
                if (fs.existsSync(p)) {
                    executablePath = p;
                    break;
                }
            }
            browser = await puppeteer.launch({
                headless: 'new',
                executablePath: executablePath,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage'
                ]
            });
        }

        const page = await browser.newPage();

        // Navigate to the HTML file (use cv2.html for alt2, cv.html?cv=alt for alt)
        const url = `http://localhost:${PORT}/${HTML_FILE}${URL_QUERY}`;
        console.log(`Loading page: ${url} (version: ${cvVersion})`);

        // Use 'load' first (reliable); networkidle0 often times out when page fetches JSON
        let navOk = false;
        try {
            await page.goto(url, { waitUntil: 'load', timeout: 30000 });
            navOk = true;
        } catch (e) {
            console.log('Load wait failed, trying domcontentloaded...');
        }
        if (!navOk) {
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            } catch (e2) {
                throw new Error(`Navigation failed: ${e2.message}`);
            }
        }

        // Wait for content to render (JavaScript needs time to load data-alt-2.json)
        console.log('Waiting for content to render...');
        await new Promise(r => setTimeout(r, 3000));
        
        // Wait for specific elements to ensure content is loaded
        try {
            await page.waitForSelector('#name', { timeout: 10000 });
            await page.waitForSelector('#aboutContent', { timeout: 10000 });
        } catch (error) {
            console.log('Warning: Some elements may not have loaded, proceeding anyway...');
        }

        // Ensure output directory exists (for alt2: pdf-alt2/)
        if (PDF_OUTPUT_DIR && !fs.existsSync(PDF_OUTPUT_DIR)) {
            fs.mkdirSync(PDF_OUTPUT_DIR, { recursive: true });
            console.log(`Created output folder: ${PDF_OUTPUT_DIR}`);
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

        // Copy PDF to Downloads folder
        const downloadsPath = '/Users/aaron/Downloads/CV-PDF';
        const downloadsFile = path.join(downloadsPath, PDF_FILENAME);
        
        try {
            // Create directory (and any subdirs like pdf-alt2) if they don't exist
            const downloadsDir = path.dirname(downloadsFile);
            if (!fs.existsSync(downloadsDir)) {
                fs.mkdirSync(downloadsDir, { recursive: true });
                console.log(`Created directory: ${downloadsDir}`);
            }
            
            // Copy the PDF file
            fs.copyFileSync(PDF_FILENAME, downloadsFile);
            console.log(`✅ PDF copied to: ${downloadsFile}`);
        } catch (copyError) {
            console.error(`⚠️  Warning: Failed to copy PDF to Downloads folder: ${copyError.message}`);
            // Don't fail the whole process if copy fails
        }

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
