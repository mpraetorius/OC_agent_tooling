# Epic 1: Documentation Development Tool - Implementation Plan

**Date:** 29/11/2025  
**Epic Goal:** Create a complete documentation generation tool that offloads heavy processing to n8n while maintaining seamless integration with OpenCode agents.

## Epic Overview

The Documentation Development Tool (`docs_develop`) will generate structured summaries of software packages for coding agent reference. This epic implements the complete end-to-end solution following the "Hybrid Agentic Tooling" architecture pattern.

### Technical Specifications
- **Architecture:** Hybrid Agentic Tooling (Fat External / Thin Internal) *[Ref: Architecture 2.0]*
- **Execution Mode:** Asynchronous (fire-and-forget) *[Ref: Architecture 2.2]*
- **Technology Stack:** Pure JavaScript (Node.js 18+)
- **Environment:** Windows/PowerShell
- **n8n Server:** *To be configured via user input* *[Ref: Architecture 5.0 Step 1]*

---

## Story 1: Create `n8n_listener.js` Generic Bridge Script

### Purpose
Build the foundational bridge component that handles asynchronous HTTP requests and file writing for all async tools. *[Ref: Architecture 3.2]*

### Task Breakdown

#### Task 1.1: Configuration Discovery Process 🔴
**Deliverable:** User input for n8n server configuration *[Ref: Architecture 5.0 Step 1]*  
**Implementation:**
- Prompt user for local n8n Server IP/URL (e.g., `http://192.168.1.50:5678`)
- Ask user for desired filename for the `docs_develop` tool
- Store configuration in memory for implementation steps
**Verification:** User provides valid n8n URL and tool filename

#### Task 1.2: Create Scripts Directory Structure 🔴
**Deliverable:** `.opencode/scripts/` directory *[Ref: Architecture 5.0 Step 2]*  
**Implementation:**
- Create directory if it doesn't exist
- Ensure proper permissions on Windows
**Verification:** Directory exists and is accessible

#### Task 1.3: Implement Core Listener Logic 🔴
**Deliverable:** `.opencode/scripts/n8n_listener.js`  
**Implementation Details:**
```javascript
// Core functionality: *[Ref: Architecture 3.2]*
- Parse CLI arguments: [URL] [JSON_PAYLOAD] [OUTPUT_FILE_PATH]
- Send POST request to n8n webhook
- Implement 3-retry mechanism for network operations
- Handle success: Write response.body.content to output file
- Handle failure: Write error details to output file
- Robust error handling and logging
```
**File Path:** `D:\Github\OC_agent_tooling\.opencode\scripts\n8n_listener.js`  
**Verification:** Script executes without syntax errors

#### Task 1.4: Add Windows-Specific Error Handling 🔴
**Deliverable:** Enhanced error handling for Windows environment  
**Implementation:**
- Handle PowerShell path escaping
- Windows file permission checks
- Proper line ending handling
**Verification:** Script runs successfully in PowerShell

#### Task 1.5: Test Listener with Mock n8n Endpoint 🔴
**Deliverable:** Verified listener functionality  
**Implementation:**
- Create test webhook endpoint
- Test successful response handling
- Test error response handling
- Test file writing to documentation/
**Verification:** All test cases pass

---

## Story 2: Build `docs_develop.js` Asynchronous Tool Definition

### Purpose
Create the tool definition that OpenCode agents will use to trigger documentation generation. *[Ref: Architecture 3.3 Type B]*

### Task Breakdown

#### Task 2.1: Create Tool Directory Structure 🔴
**Deliverable:** `.opencode/tool/` directory (if needed) *[Ref: Architecture 3.1]*  
**Implementation:**
- Verify directory exists
- Ensure proper structure
**Verification:** Directory structure is correct

#### Task 2.2: Implement Tool Wrapper Function 🔴
**Deliverable:** `.opencode/tool/docs_develop.js`  
**Implementation Details:**
```javascript
// Tool signature: *[Ref: Architecture 3.3 Type B]*
async function docs_develop(packageName) {
    // Input validation
    // Generate output filename: documentation/{packageName}_summary.md
    // Construct payload for n8n
    // Spawn n8n_listener.js with detached process
    // Return immediate confirmation message
}
```
**File Path:** `D:\Github\OC_agent_tooling\.opencode\tool\docs_develop.js`  
**Verification:** Tool function is properly defined

#### Task 2.3: Add Input Validation and Sanitization 🔴
**Deliverable:** Robust input handling  
**Implementation:**
- Validate package name format
- Sanitize for file system safety
- Handle edge cases (empty input, special characters)
**Verification:** All validation tests pass

#### Task 2.4: Implement Asynchronous Process Spawning 🔴
**Deliverable:** Background process execution  
**Implementation:**
```javascript
// Implementation: *[Ref: Architecture 3.3 Type B]*
const { spawn } = require("child_process");
const child = spawn("node", [
    "scripts/n8n_listener.js",
    N8N_WEBHOOK_URL,
    JSON.stringify(payload),
    outputFilePath
], {
    detached: true,
    stdio: "ignore"
});
child.unref(); // Critical for fire-and-forget
```
**Verification:** Process spawns correctly and doesn't block

#### Task 2.5: Add JSDoc Documentation 🔴
**Deliverable:** Complete tool documentation  
**Implementation:**
- Function description and parameters
- Usage examples
- Return value documentation
**Verification:** JSDoc is properly formatted

---

## Story 3: Design n8n Workflow for Documentation Synthesis

### Purpose
Create the n8n workflow that handles the actual documentation generation logic. *[Ref: Architecture 4.0]*

### Task Breakdown

#### Task 3.1: Design Workflow Architecture 🔴
**Deliverable:** Workflow blueprint and node sequence *[Ref: Architecture 4.2]*  
**Implementation:**
- Webhook trigger (POST)
- Input validation node
- **Required Node Types:** `Serper Dev`, `Google Books`, `Scraper` → `LLM Chain` *[Ref: Architecture 4.2]*
- Content aggregation node
- LLM synthesis node
- Response formatting node
- **End with:** `Respond to Webhook` node *[Ref: Architecture 4.3]*
**Verification:** Workflow design follows system architecture

#### Task 3.2: Configure Webhook Trigger 🔴
**Deliverable:** Webhook endpoint configuration *[Ref: Architecture 4.1]*  
**Implementation:**
- POST method
- Authentication: None (Internal Network) or Basic Auth (if required) *[Ref: Architecture 4.1]*
- JSON body parsing
- Expected input: `{ "packageName": "..." }`
**Verification:** Webhook accepts test requests

#### Task 3.3: Implement Search Logic 🔴
**Deliverable:** Multi-source search configuration *[Ref: Architecture 4.2]*  
**Implementation:**
- **Required Nodes:** `Serper Dev` for Google Search integration
- **Required Nodes:** `Google Books` for documentation search
- **Required Nodes:** `Scraper` for content extraction
- GitHub repository search
- Official documentation search
- Package registry search (npm, PyPI, etc.)
**Verification:** Search returns relevant results

#### Task 3.4: Configure LLM Synthesis 🔴
**Deliverable:** Content generation logic *[Ref: Architecture 4.2]*  
**Implementation:**
- **Required Node:** `LLM Chain` for content synthesis *[Ref: Architecture 4.2]*
- Prompt engineering for structured output
- Template for documentation format:
  - Software purpose and overview
  - Key concepts and terminology
  - Documentation index with links
**Verification:** Generated content matches requirements

#### Task 3.5: Set Output Format 🔴
**Deliverable:** Standardized response format *[Ref: Architecture 4.3]*  
**Implementation:**
```json
{
    "content": "Generated markdown documentation",
    "packageName": "input_package_name",
    "timestamp": "ISO_timestamp"
}
```
**Verification:** Response format matches listener expectations

#### Task 3.6: Create Workflow Verification Test 🔴
**Deliverable:** cURL test command for workflow verification *[Ref: Architecture 5.0 Step 4]*  
**Implementation:**
- Generate cURL command for testing webhook
- Include sample payload
- Test with actual n8n instance
**Verification:** Workflow responds correctly to cURL test

#### Task 3.7: Add "Stop and Wait" Instructions 🔴
**Deliverable:** User guidance for workflow creation *[Ref: Architecture 5.0 Step 4]*  
**Implementation:**
- Provide clear "Stop and wait" instruction pattern
- Document workflow creation steps
- Include verification checklist
**Verification:** User can successfully create and test workflow

---

## Story 4: Test End-to-End Documentation Generation

### Purpose
Verify the complete system works from agent call to final documentation output.

### Task Breakdown

#### Task 4.1: Unit Test n8n Listener 🔴
**Deliverable:** Listener test suite  
**Implementation:**
- Test argument parsing
- Test HTTP request handling
- Test file writing
- Test error scenarios
**Verification:** All unit tests pass

#### Task 4.2: Unit Test docs_develop Tool 🔴
**Deliverable:** Tool test suite  
**Implementation:**
- Test input validation
- Test process spawning
- Test return messages
- Test edge cases
**Verification:** All unit tests pass

#### Task 4.3: Integration Test with n8n Workflow 🔴
**Deliverable:** End-to-end workflow test  
**Implementation:**
- Test with known package (e.g., "OpenCode")
- Verify webhook receives request
- Verify workflow processes correctly
- Verify response format
**Verification:** Complete workflow executes successfully

#### Task 4.4: File Output Verification 🔴
**Deliverable:** Output validation test  
**Implementation:**
- Check file creation in documentation/
- Verify markdown formatting
- Verify content structure
- Verify file naming convention
**Verification:** Output meets all requirements

#### Task 4.5: Performance and Error Handling Test 🔴
**Deliverable:** Robustness verification  
**Implementation:**
- Test with invalid package names
- Test network failure scenarios
- Test n8n service unavailable
- Verify 3-retry mechanism
**Verification:** System handles errors gracefully

#### Task 4.6: User Acceptance Testing 🔴
**Deliverable:** User sign-off on functionality  
**Implementation:**
- Demonstrate tool usage
- Verify output quality
- Confirm integration with agent workflows
- Document usage procedures
**Verification:** User approval obtained

---

## Story 5: Implementation Verification and User Guidance

### Purpose
Ensure complete system integration following the 5-step implementation checklist from architecture. *[Ref: Architecture 5.0]*

### Task Breakdown

#### Task 5.1: Complete Configuration Discovery ✅
**Deliverable:** Verified n8n server configuration *[Ref: Architecture 5.0 Step 1]*  
**Implementation:**
- Confirm n8n Server IP/URL from user
- Verify desired tool filenames
- Store configuration for implementation
**Verification:** All configuration parameters collected

#### Task 5.2: Verify Infrastructure Setup ✅
**Deliverable:** Complete directory structure *[Ref: Architecture 5.0 Step 2]*  
**Implementation:**
- Confirm `.opencode/scripts/` directory exists
- Verify `n8n_listener.js` is generated
- Check Windows permissions
**Verification:** Infrastructure is ready

#### Task 5.3: Complete Tool Generation ✅
**Deliverable:** All tool files created *[Ref: Architecture 5.0 Step 3]*  
**Implementation:**
- Verify `docs_develop.js` is generated
- Check tool follows Type B pattern
- Validate async process spawning
**Verification:** Tools are properly implemented

#### Task 5.4: Guide n8n Workflow Creation 🔴
**Deliverable:** User successfully creates n8n workflow *[Ref: Architecture 5.0 Step 4]*  
**Implementation:**
- **Stop and wait** - instruct user to create workflow
- Provide cURL test command for verification
- Verify workflow meets contract requirements
**Verification:** Workflow passes cURL test

#### Task 5.5: Final System Verification 🔴
**Deliverable:** End-to-end functionality confirmed *[Ref: Architecture 5.0 Step 5]*  
**Implementation:**
- Test synchronous tool invocation
- Test asynchronous tool and check `documentation/` output
- Verify all error handling works
**Verification:** Complete system operates correctly

---

## Architecture Compliance Checklist

### Required Components ✅
- [ ] Generic Listener (`n8n_listener.js`) *[Ref: Architecture 3.2]*
- [ ] Asynchronous Tool (`docs_develop.js`) *[Ref: Architecture 3.3 Type B]*
- [ ] n8n Workflow with required nodes *[Ref: Architecture 4.2]*
- [ ] Proper output format handling *[Ref: Architecture 4.3]*

### Workflow Contract Compliance ✅
- [ ] Webhook trigger (POST) *[Ref: Architecture 4.1]*
- [ ] Required nodes: `Serper Dev`, `Google Books`, `Scraper`, `LLM Chain` *[Ref: Architecture 4.2]*
- [ ] `Respond to Webhook` node at end *[Ref: Architecture 4.3]*
- [ ] JSON response with `content` key *[Ref: Architecture 4.3]*
- [ ] Basic Auth option (if required) *[Ref: Architecture 4.1]*

### Implementation Process Compliance ✅
- [ ] Step 1: Configuration Discovery completed *[Ref: Architecture 5.0]*
- [ ] Step 2: Infrastructure Setup completed *[Ref: Architecture 5.0]*
- [ ] Step 3: Tool Generation completed *[Ref: Architecture 5.0]*
- [ ] Step 4: n8n Guidance with "Stop and wait" *[Ref: Architecture 5.0]*
- [ ] Step 5: Final Verification completed *[Ref: Architecture 5.0]*

---

## Dependencies and Prerequisites

### Technical Dependencies
- 🔲 n8n server running at user-provided URL *[Ref: Architecture 5.0 Step 1]*
- ✅ Node.js 18+ installed
- ✅ PowerShell environment
- ✅ Project structure in place

### Task Dependencies
```
Story 1 → Story 2 → Story 3 → Story 4 → Story 5
   ↓         ↓         ↓         ↓         ↓
Listener → Tool → Workflow → Testing → Verification
```

### Critical Path *[Ref: Architecture 5.0]*
1. **Configuration Discovery** must be completed before infrastructure setup
2. **n8n_listener.js** must be completed before tool development
3. **Tool definition** must be completed before workflow testing
4. **n8n workflow** must be deployed before end-to-end testing
5. **"Stop and wait" guidance** must be provided before user creates workflow
6. **Final verification** must be completed before user acceptance

---

## Risk Mitigation

### Technical Risks
- **Network Connectivity:** Implement robust retry mechanism
- **File Permissions:** Test Windows file system access
- **Process Spawning:** Verify detached process behavior
- **n8n Integration:** Test with actual n8n instance early

### Quality Assurance
- Code review for each component
- Automated testing where possible
- Manual verification of critical paths
- Documentation for maintenance

---

## Success Criteria

### Functional Requirements
- ✅ Agent can call `docs_develop("packageName")`
- ✅ Process runs asynchronously without blocking
- ✅ Documentation file generated in `documentation/`
- ✅ Output follows specified structure
- ✅ Error handling works correctly

### Non-Functional Requirements
- ✅ Windows/PowerShell compatibility
- ✅ Pure JavaScript implementation
- ✅ Integration with existing n8n server
- ✅ User acceptance testing completed
- ✅ Documentation for maintenance and usage

---

## Progress Tracking

| Story | Status | Completion |
|-------|--------|------------|
| Story 1: n8n_listener.js | 🔴 Not Started | 0% |
| Story 2: docs_develop.js | 🔴 Not Started | 0% |
| Story 3: n8n Workflow | 🔴 Not Started | 0% |
| Story 4: Testing | 🔴 Not Started | 0% |
| Story 5: Implementation Verification | 🔴 Not Started | 0% |

**Overall Epic Progress:** 🔴 0% Complete

### Architecture Compliance Status
- [ ] Configuration Discovery *[Ref: Architecture 5.0 Step 1]*
- [ ] Infrastructure Setup *[Ref: Architecture 5.0 Step 2]*
- [ ] Tool Generation *[Ref: Architecture 5.0 Step 3]*
- [ ] n8n Workflow Contract *[Ref: Architecture 4.0]*
- [ ] Final Verification *[Ref: Architecture 5.0 Step 5]*

---

## Next Steps *[Ref: Architecture 5.0 Implementation Process]*

1. **Immediate:** Configuration Discovery - Get n8n server URL from user *[Ref: Architecture 5.0 Step 1]*
2. **Following:** Begin Story 1 - Create the generic listener script *[Ref: Architecture 5.0 Step 2]*
3. **Next:** Implement tool definition once listener is complete *[Ref: Architecture 5.0 Step 3]*
4. **Critical:** **Stop and wait** - Guide user through n8n workflow creation *[Ref: Architecture 5.0 Step 4]*
5. **Final:** Comprehensive testing and final verification *[Ref: Architecture 5.0 Step 5]*

### Key Architecture References
- **Hybrid Agentic Tooling Pattern:** *[Ref: Architecture 2.0]*
- **Asynchronous Execution Mode:** *[Ref: Architecture 2.2]*
- **Generic Listener Specification:** *[Ref: Architecture 3.2]*
- **Tool Type B Pattern:** *[Ref: Architecture 3.3]*
- **n8n Workflow Contract:** *[Ref: Architecture 4.0]*

---

*This implementation plan follows the "Hybrid Agentic Tooling" architecture and ensures all technical requirements are met while maintaining compatibility with the Windows/PowerShell environment.*