# Environmental Context

## Operating System & Shell
- **OS:** Windows
- **Shell:** PowerShell

## JavaScript Environment
- **Runtime:** Node.js 18+ (LTS)
- **Package Manager:** npm
- **Target:** Pure JavaScript (no Python dependencies)

## n8n Server Configuration
- **Internal Server URL:** http://10.1.1.101:5678/
- **External Webhook Base:** https://webhooks.prenzler.xyz/webhook/
- **Infrastructure:** Caddy reverse proxy with HTTPS termination
- **Authentication:** None (internal network)
- **Status:** Production-ready with verified webhook connectivity

## Development Standards
- **Language:** ES6+ JavaScript
- **Style:** Standard Node.js conventions
- **Error Handling:** 3-retry mechanism for network operations
- **Documentation:** JSDoc comments for tool functions

## Project Structure
- **Tool Definitions:** `.opencode/tool/*.js`
- **Scripts:** `.opencode/scripts/`
- **Output Target:** `documentation/`
- **Architecture:** Following "Hybrid Agentic Tooling" pattern

## Integration Requirements
- **Execution Modes:** Both synchronous and asynchronous as specified
- **Output Format:** JSON responses with specific keys (content/markdown)
- **Testing:** Full end-to-end testing required
- **User Acceptance:** Final sign-off required
