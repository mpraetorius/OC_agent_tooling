# Product Requirements Document: n8n-OpenCode Integration Tools

## 1.0 Executive Summary
Develop 4 integrated tools that bridge OpenCode agents with n8n workflows, following the "Hybrid Agentic Tooling" architecture. Each tool will offload heavy processing to n8n while maintaining seamless integration with OpenCode's agent ecosystem.

## 2.0 Tool Specifications

### 2.1 Tool 1: Documentation Development Tool (docs_develop_llms)
**Purpose:** Generate structured summaries of software packages for coding agent reference
**Input:** llms.txt URL (e.g., "https://www.langflow.org/llms.txt", "https://github.com/example/repo/blob/main/llms.txt")
**Process:** Hybrid approach using llms.txt + selective detail fetching
**Output:** Structured Markdown documentation including:
- Software purpose and overview
- Key concepts and terminology
- Documentation index with links to detailed information
- Section-based navigation with heading hierarchies
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
