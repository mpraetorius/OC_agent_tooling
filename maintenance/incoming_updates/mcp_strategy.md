\# System Architecture: MCP Integration Strategy



\## 1.0 Core Philosophy: Delegated Access

To maintain system stability and context hygiene, we enforce a strict \*\*Brain vs. Hand\*\* separation for Model Context Protocol (MCP) servers.



\*   \*\*The Problem:\*\* MCP tools (especially Web Readers and Search) return large volumes of raw text. Feeding this directly to the Orchestrator ("Brain") clogs its context window, increases costs, and causes "Thinking" models to freeze or hallucinate.

\*   \*\*The Solution:\*\* \*\*Delegated Access.\*\* The Orchestrator plans the retrieval; the Operator executes it.



\## 2.0 Agent Roles \& Permissions



\### 2.1 Orchestrator (The Brain)

\*   \*\*MCP Access:\*\* \*\*NONE.\*\*

\*   \*\*Behavior:\*\* Must never attempt to call an MCP tool directly.

\*   \*\*Protocol:\*\* Delegates all information retrieval to the Operator.

&nbsp;   \*   \*Incorrect:\* "I will search context7 for the schema."

&nbsp;   \*   \*Correct:\* "Operator, please use the `context7` MCP tool to look up the schema."



\### 2.2 Operator (The Hand)

\*   \*\*MCP Access:\*\* \*\*FULL.\*\*

\*   \*\*Behavior:\*\* Serves as the interface for "Quick Lookups" and granular data retrieval.

\*   \*\*Protocol:\*\*

&nbsp;   1.  Receives specific query from Orchestrator.

&nbsp;   2.  Executes MCP tool.

&nbsp;   3.  \*\*Synthesizes/Filters\*\* the output.

&nbsp;   4.  Returns \*only\* the relevant answer to the Orchestrator (preserving context hygiene).



\## 3.0 Tool Selection Matrix: MCP vs. n8n



The Operator has two ways to fetch data. Use this logic to decide which to use:



| Scenario | Preferred Toolchain | Why? |

| :--- | :--- | :--- |

| \*\*Quick Fact Check\*\*<br>\*(e.g., "What is the syntax for `tool.schema`?")\* | \*\*MCP (Direct)\*\* | Lowest latency. No overhead. Direct access to specific API/Doc data. |

| \*\*Single Page Lookup\*\*<br>\*(e.g., "Get the pricing from this URL")\* | \*\*MCP (Web Reader)\*\* | Fast. Valid for small pages (<2k tokens). |

| \*\*Deep Research\*\*<br>\*(e.g., "Compare 5 libraries and write a report")\* | \*\*n8n (`research\_deep`)\*\* | Requires reasoning loops and synthesis. Keeping this "thought process" out of the main chat is cheaper and safer. |

| \*\*Context Ingestion\*\*<br>\*(e.g., "Read the entire Docs site and save to file")\* | \*\*n8n (`ingest\_url`)\*\* | \*\*Critical.\*\* MCPs dump text into Chat Context (Ephemeral). n8n dumps text into Files (Persistent). |



\## 4.0 Implementation Instructions



\### 4.1 Update `opencode.json` (User Action)

Ensure MCP servers are registered in the global configuration:

```json

"mcpServers": {

&nbsp; "context7": { "command": "npx", "args": \["-y", "@context7/mcp"] },

&nbsp; "brave-search": { "command": "npx", "args": \["-y", "@modelcontextprotocol/server-brave-search"] }

}

```



\### 4.2 Update `agent/Orchestrator.md`

Add the following directive to the \*\*Interaction Protocol\*\*:

> \*\*Strict Tool Isolation:\*\*

> You do not have access to MCP Servers. If you need to look up documentation or search the web, you \*\*MUST\*\* instruct the \*\*Operator\*\* to do it.



\### 4.3 Update `agent/Operator.md`

Add the following directive to the \*\*Operational Rules\*\*:

> \*\*Context Hygiene Protocol:\*\*

> When using MCP tools (Search, Reader), \*\*DO NOT\*\* dump the full raw output back to the Orchestrator unless explicitly asked. Read the output, extract the specific answer, and report that.

