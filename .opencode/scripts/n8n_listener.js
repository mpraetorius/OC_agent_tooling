#!/usr/bin/env node

/**
 * n8n_listener.js - Webhook Listener for n8n Integration
 * 
 * This script sends a POST request to an n8n webhook with a JSON payload
 * and saves the response content to an output file.
 * 
 * Usage: node n8n_listener.js <URL> <JSON_PAYLOAD> <OUTPUT_FILE_PATH>
 * 
 * Arguments:
 *   URL              - The webhook URL to send the request to
 *   JSON_PAYLOAD     - JSON string payload to send in the request body
 *   OUTPUT_FILE_PATH - Path where the response content will be saved
 * 
 * Features:
 *   - 3-retry mechanism with exponential backoff
 *   - Robust error handling and logging
 *   - Cross-platform compatibility (Windows/PowerShell)
 *   - Pure Node.js implementation (no external dependencies)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration constants
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;
const MAX_DELAY_MS = 8000;

/**
 * Utility function to log messages with timestamp
 */
function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(attempt) {
    const exponentialDelay = Math.min(INITIAL_DELAY_MS * Math.pow(2, attempt), MAX_DELAY_MS);
    const jitter = Math.random() * 0.1 * exponentialDelay; // Add 10% jitter
    return Math.floor(exponentialDelay + jitter);
}

/**
 * Sleep function for delays
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parse and validate JSON payload
 */
function parseJsonPayload(payloadString) {
    try {
        const parsed = JSON.parse(payloadString);
        log(`Successfully parsed JSON payload: ${JSON.stringify(parsed, null, 2)}`, 'DEBUG');
        return parsed;
    } catch (error) {
        log(`Failed to parse JSON payload: ${error.message}`, 'ERROR');
        throw new Error(`Invalid JSON payload: ${error.message}`);
    }
}

/**
 * Validate output file path and create directory if needed
 */
function validateOutputPath(outputPath) {
    try {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            log(`Creating directory: ${dir}`, 'INFO');
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Test write access
        const testFile = `${outputPath}.test`;
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        
        log(`Output path validated: ${outputPath}`, 'DEBUG');
        return true;
    } catch (error) {
        log(`Failed to validate output path: ${error.message}`, 'ERROR');
        throw new Error(`Cannot write to output path: ${error.message}`);
    }
}

/**
 * Send HTTP/HTTPS request with retry mechanism
 */
async function sendRequest(url, payload, retryCount = 0) {
    return new Promise((resolve, reject) => {
        const isHttps = url.startsWith('https://');
        const client = isHttps ? https : http;
        
        // Parse URL components
        let urlObj;
        try {
            urlObj = new URL(url);
        } catch (error) {
            reject(new Error(`Invalid URL format: ${error.message}`));
            return;
        }

        // Prepare request options
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'n8n-listener/1.0.0',
                'Accept': 'application/json'
            },
            timeout: 30000 // 30 seconds timeout
        };

        log(`Attempt ${retryCount + 1}/${MAX_RETRIES}: Sending POST request to ${url}`, 'INFO');
        
        const requestBody = JSON.stringify(payload);
        options.headers['Content-Length'] = Buffer.byteLength(requestBody);

        const req = client.request(options, (res) => {
            let responseData = '';
            
            log(`Response status: ${res.statusCode}`, 'DEBUG');
            log(`Response headers: ${JSON.stringify(res.headers, null, 2)}`, 'DEBUG');

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                log(`Response received (${responseData.length} bytes)`, 'DEBUG');
                
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: responseData,
                        success: true
                    });
                } else if (res.statusCode >= 400 && res.statusCode < 500 && retryCount < MAX_RETRIES - 1) {
                    // Client errors (4xx) should not be retried unless it's a rate limit
                    if (res.statusCode === 429) { // Rate limit
                        const error = new Error(`HTTP ${res.statusCode}: Rate limited`);
                        error.statusCode = res.statusCode;
                        error.retryable = true;
                        reject(error);
                    } else {
                        const error = new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`);
                        error.statusCode = res.statusCode;
                        error.retryable = false;
                        reject(error);
                    }
                } else {
                    const error = new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`);
                    error.statusCode = res.statusCode;
                    error.retryable = true;
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            log(`Request error: ${error.message}`, 'ERROR');
            error.retryable = true;
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            const error = new Error('Request timeout');
            error.retryable = true;
            reject(error);
        });

        // Send the request
        req.write(requestBody);
        req.end();
    });
}

/**
 * Write response or error to output file
 */
function writeOutput(outputPath, data, isError = false) {
    try {
        let output;
        
        if (isError) {
            output = JSON.stringify({
                success: false,
                error: data.message || 'Unknown error',
                timestamp: new Date().toISOString(),
                details: data
            }, null, 2);
        } else {
            // Try to parse response as JSON first
            let responseData;
            try {
                responseData = JSON.parse(data.body);
            } catch (e) {
                // If parsing fails, treat as raw text
                responseData = { content: data.body };
            }
            
            output = JSON.stringify({
                success: true,
                timestamp: new Date().toISOString(),
                statusCode: data.statusCode,
                response: responseData
            }, null, 2);
        }
        
        fs.writeFileSync(outputPath, output, 'utf8');
        log(`Output written to: ${outputPath}`, 'INFO');
    } catch (error) {
        log(`Failed to write output file: ${error.message}`, 'ERROR');
        throw error;
    }
}

/**
 * Main execution function
 */
async function main() {
    try {
        log('n8n_listener.js started', 'INFO');
        log(`Node.js version: ${process.version}`, 'DEBUG');
        log(`Platform: ${process.platform}`, 'DEBUG');
        
        // Parse command line arguments
        const args = process.argv.slice(2);
        
        if (args.length !== 3) {
            console.error('\nUsage: node n8n_listener.js <URL> <JSON_PAYLOAD> <OUTPUT_FILE_PATH>');
            console.error('\nArguments:');
            console.error('  URL              - The webhook URL to send the request to');
            console.error('  JSON_PAYLOAD     - JSON string payload to send in the request body');
            console.error('  OUTPUT_FILE_PATH - Path where the response content will be saved');
            console.error('\nExample:');
            console.error('  node n8n_listener.js "https://example.com/webhook" "{\"data\":\"test\"}" "output.json"');
            process.exit(1);
        }

        const [url, payloadString, outputPath] = args;
        
        log(`URL: ${url}`, 'INFO');
        log(`Payload: ${payloadString}`, 'INFO');
        log(`Output Path: ${outputPath}`, 'INFO');

        // Parse and validate inputs
        const payload = parseJsonPayload(payloadString);
        validateOutputPath(outputPath);

        // Send request with retry mechanism
        let lastError;
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                const response = await sendRequest(url, payload, attempt);
                log('Request successful', 'INFO');
                
                // Write successful response to output file
                writeOutput(outputPath, response, false);
                log('Script completed successfully', 'INFO');
                process.exit(0);
                
            } catch (error) {
                lastError = error;
                log(`Attempt ${attempt + 1} failed: ${error.message}`, 'ERROR');
                
                // Check if error is retryable
                if (!error.retryable || attempt === MAX_RETRIES - 1) {
                    break;
                }
                
                // Calculate delay and wait before retry
                const delay = calculateDelay(attempt);
                log(`Waiting ${delay}ms before retry...`, 'INFO');
                await sleep(delay);
            }
        }

        // All attempts failed
        log(`All ${MAX_RETRIES} attempts failed`, 'ERROR');
        writeOutput(outputPath, lastError, true);
        log('Script completed with errors', 'ERROR');
        process.exit(1);

    } catch (error) {
        log(`Fatal error: ${error.message}`, 'ERROR');
        console.error(`\nFatal Error: ${error.message}`);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    log(`Uncaught exception: ${error.message}`, 'ERROR');
    console.error(`Uncaught Exception: ${error.message}`);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled rejection at: ${promise}, reason: ${reason}`, 'ERROR');
    console.error(`Unhandled Rejection: ${reason}`);
    process.exit(1);
});

// Run the main function
if (require.main === module) {
    main();
}

module.exports = {
    sendRequest,
    parseJsonPayload,
    validateOutputPath,
    writeOutput
};