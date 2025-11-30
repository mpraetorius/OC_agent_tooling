/**
 * Documentation Development Tool - llms.txt Approach (docs_develop_llms)
 * 
 * Generates structured documentation from llms.txt files using n8n workflow processing.
 * This tool follows the "Hybrid Agentic Tooling" architecture pattern and executes
 * asynchronously using the n8n_listener.js bridge script.
 * 
 * @function docs_develop_llms
 * @async
 * @param {string} llmsTxtUrl - Direct URL to the llms.txt file (e.g., "https://www.langflow.org/llms.txt")
 * @returns {Promise<string>} A confirmation message indicating the documentation generation has been initiated
 * 
 * @example
 * // Generate documentation from langflow's llms.txt
 * await docs_develop_llms("https://www.langflow.org/llms.txt");
 * // Returns: "Documentation generation initiated for langflow. Output will be saved to documentation/langflow_summary.md"
 * 
 * @example
 * // Generate documentation from mintlify's llms.txt
 * await docs_develop_llms("https://docs.mintlify.com/llms.txt");
 * // Returns: "Documentation generation initiated for mintlify. Output will be saved to documentation/mintlify_summary.md"
 * 
 * @description
 * This tool performs the following operations:
 * 1. Validates the llms.txt URL format and accessibility
 * 2. Extracts domain name for output filename generation
 * 3. Generates output filename in format: documentation/{domain}_summary.md
 * 4. Constructs JSON payload for n8n workflow processing
 * 5. Spawns n8n_listener.js as a detached background process
 * 6. Returns immediate confirmation to the calling agent
 * 
 * The actual documentation generation happens asynchronously in the background.
 * The n8n workflow will:
 * - Fetch the llms.txt file from the provided URL
 * - Parse the structured content (project name, summary, sections, links)
 * - Optionally fetch key pages for additional heading structure
 * - Generate structured markdown documentation
 * - Save the output to the specified file
 * 
 * Expected output structure in the generated file:
 * - Software purpose and overview
 * - Key concepts and terminology  
 * - Documentation index with links to detailed information
 * - Structured sections with heading hierarchies
 */

const { spawn } = require("child_process");
const path = require("path");

/**
 * Validates and normalizes a URL for llms.txt processing
 * @param {string} url - The llms.txt URL to validate
 * @returns {Object} Normalized URL information including domain
 * @throws {Error} If URL is invalid or unsafe
 */
function validateLlmsTxtUrl(url) {
    if (!url || typeof url !== 'string') {
        throw new Error('URL must be a non-empty string');
    }
    
    // Trim whitespace
    const trimmed = url.trim();
    
    if (trimmed.length === 0) {
        throw new Error('URL cannot be empty');
    }
    
    if (trimmed.length > 500) {
        throw new Error('URL too long (max 500 characters)');
    }
    
    // Basic URL validation
    let urlObj;
    try {
        urlObj = new URL(trimmed);
    } catch (error) {
        throw new Error(`Invalid URL format: ${error.message}`);
    }
    
    // Validate protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('URL must use HTTP or HTTPS protocol');
    }
    
    // Ensure path ends with llms.txt
    if (!urlObj.pathname.endsWith('/llms.txt')) {
        throw new Error('URL must point to an llms.txt file (path must end with /llms.txt)');
    }
    
    // Extract domain for filename
    let domain = urlObj.hostname;
    // Remove www. prefix if present
    if (domain.startsWith('www.')) {
        domain = domain.substring(4);
    }
    
    // Additional sanitization for domain as filename
    const safeDomain = domain.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    return {
        normalizedUrl: urlObj.toString(),
        domain: safeDomain,
        hostname: urlObj.hostname
    };
}

/**
 * Main tool function for llms.txt-based documentation generation
 * @param {string} llmsTxtUrl - Direct URL to the llms.txt file
 * @returns {Promise<string>} Confirmation message
 */
async function docs_develop_llms(llmsTxtUrl) {
    try {
        // Input validation and URL processing
        const urlInfo = validateLlmsTxtUrl(llmsTxtUrl);
        
        // Generate output file path
        const outputFileName = `${urlInfo.domain}_summary.md`;
        const outputFilePath = path.join('documentation', outputFileName);
        
        // Hard-coded webhook URL for llms.txt processing
        const n8nWebhookUrl = 'https://webhooks.prenzler.xyz/webhook/docs_develop_llms';
        
        // Construct payload for n8n workflow
        const payload = {
            llmsTxtUrl: urlInfo.normalizedUrl,
            domain: urlInfo.domain,
            timestamp: new Date().toISOString(),
            outputPath: outputFilePath,
            requestedBy: 'docs_develop_llms_tool'
        };
        
        // Spawn n8n_listener.js as detached background process
        const listenerPath = path.join(__dirname, '..', 'scripts', 'n8n_listener.js');
        const child = spawn("node", [
            listenerPath,
            n8nWebhookUrl,
            JSON.stringify(payload),
            outputFilePath
        ], {
            detached: true,
            stdio: "ignore",
            cwd: path.join(__dirname, '..', '..') // Set working directory to repo root
        });
        
        // Critical for fire-and-forget behavior
        child.unref();
        
        // Return immediate confirmation
        return `Documentation generation initiated for ${urlInfo.domain}. Output will be saved to ${outputFilePath}`;
        
    } catch (error) {
        throw new Error(`Failed to initiate documentation generation: ${error.message}`);
    }
}

module.exports = { docs_develop_llms };