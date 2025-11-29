# Product Requirements Document: n8n-OpenCode Integration Tools

## 1.0 Executive Summary
Develop 4 integrated tools that bridge OpenCode agents with n8n workflows, following the "Hybrid Agentic Tooling" architecture. Each tool will offload heavy processing to n8n while maintaining seamless integration with OpenCode's agent ecosystem.

## 2.0 Tool Specifications

### 2.1 Tool 1: Documentation Development Tool (docs_develop)
**Purpose:** Generate structured summaries of software packages for coding agent reference
**Input:** Software package name (e.g., "OpenCode", "n8n", "Docker")
**Output:** Structured Markdown documentation including:
- Software purpose and overview
- Key concepts and terminology
- Documentation index with links to detailed information
**Execution Mode:** Asynchronous (fire-and-forget)
**Success Criteria:** Agent can understand "big picture" without exhaustive details and provides guidance on where the agent can find more details.

### 2.2 Tool 2: Website Ingestion Tool (ingest_url)
**Purpose:** Convert web pages to formatted Markdown documentation
**Input:** Single URL
**Output:** Cleanly formatted Markdown file in documentation folder
**Execution Mode:** Asynchronous (fire-and-forget)
**Success Criteria:** LLM-discretionary formatting that preserves readability without changing content (e.g. no summarisation).

### 2.3 Tool 3: Quick Research Tool (research_quick)
**Purpose:** Rapid internet search and summarization
**Input:** Search query/concept
**Process:** Search ~10 URLs, scrape content, provide summary
**Output:** Concise research summary
**Execution Mode:** Synchronous (blocking, <30s)
**Success Criteria:** Fast turnaround with basic overview

### 2.4 Tool 4: Deep Research Tool (research_deep)
**Purpose:** Comprehensive, intelligent research with iterative refinement
**Input:** Research topic/concept
**Process:** 
- Initial search → LLM review of relevance
- Iterative re-search with refined terms if needed
- Deep analysis before final summary
**Output:** Comprehensive research report
**Execution Mode:** Asynchronous (fire-and-forget)
**Success Criteria:** Thorough coverage with intelligent source selection

## 3.0 Technical Requirements

### 3.1 Architecture Compliance
- Follow "Hybrid Agentic Tooling" pattern from `agentic_tooling_system_architecture.md`
- Use Pure JavaScript toolchain (no Python dependencies)
- Implement both sync and async execution modes as specified

### 3.2 Error Handling
- 3-retry mechanism for all network operations
- Clear error notifications on persistent failures
- Graceful degradation when services unavailable

### 3.3 Integration Requirements
- Full end-to-end solution including n8n workflows
- Complete testing and user sign-off
- Compatibility with existing n8n server

## 4.0 Success Metrics
- All 4 tools functional and tested
- n8n workflows operational and documented
- User acceptance testing completed
- Integration seamless with OpenCode agent workflows

## 5.0 Implementation Plan

## Epic 1: Documentation Development Tool
**Stories:**
1. Create `n8n_listener.js` generic bridge script
2. Build `docs_develop.js` asynchronous tool definition
3. Design n8n workflow for documentation synthesis
4. Test end-to-end documentation generation

## Epic 2: Website Ingestion Tool
**Stories:**
1. Build `ingest_url.js` asynchronous tool definition
2. Design n8n workflow for URL-to-Markdown conversion
3. Test content preservation (no summarization)
4. Verify Markdown formatting quality

## Epic 3: Quick Research Tool
**Stories:**
1. Build `research_quick.js` synchronous tool definition
2. Design n8n workflow for rapid search (~10 URLs)
3. Test sub-30 second response times
4. Verify search result quality and summarization

## Epic 4: Deep Research Tool
**Stories:**
1. Build `research_deep.js` asynchronous tool definition
2. Design n8n workflow with intelligent iterative search
3. Test LLM-driven relevance assessment
4. Verify comprehensive research coverage

## Epic 5: Integration & Testing
**Stories:**
1. Implement 3-retry error handling across all tools
2. Create comprehensive test suite for all tools
3. Document n8n workflow setup procedures
4. Conduct user acceptance testing
5. Final integration sign-off
