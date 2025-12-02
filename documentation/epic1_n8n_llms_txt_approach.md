# n8n Hybrid Workflow: llms.txt + Selective Detail Fetching

This workflow is designed to generate high-level documentation for coding agents by leveraging a site's `llms.txt` file (if present) and selectively crawling key documentation pages for additional detail. It builds a structured, navigable overview and can be extended for any software documentation site implementing this emerging AI-friendly standard.

---

## Workflow Overview

- **Step 1:** Fetch the site's `/llms.txt`
- **Step 2:** Parse llms.txt for high-level navigation (project name, summary, sections, links)
- **Step 3:** Identify high-priority pages (based on section titles, keywords, or descriptions)
- **Step 4:** Fetch selected documentation pages for detailed structure (ex: heading hierarchy)
- **Step 5:** Merge llms.txt navigation with extracted heading trees for a knowledge-rich output
- **Step 6:** Output as JSON or Markdown for agent consumption

---

## Example Workflow Structure

1. **HTTP Request Node (GET `/llms.txt`)**
   - Request the `llms.txt` file from the documentation root.

2. **Code Node: Parse Markdown**
   - Extract the H1 project name.
   - Extract the summary blockquote.
   - Identify all section headers (H2, formatted as `## Section Name`).
   - Parse markdown lists for page links and descriptions under each section.

3. **Filter/Scoring Node: Prioritize Key Pages**
   - Use keywords, section, or description heuristics to identify important pages (e.g., "Getting Started", "API Reference", "Configuration", "Integrations").

4. **HTTP Request Nodes (Batch, Fetch Selected URLs)**
   - For each high-priority page, fetch its HTML content.

5. **HTML Extract Nodes**
   - Extract the heading structure (`h1`, `h2`, `h3`, ...) from each page.

6. **Merge Node**
   - Combine the llms.txt hierarchy with the detailed heading trees of selected pages.

7. **(Optional) AI Node: Enhance Summaries**
   - Generate concise summaries for each section/page if additional context is needed.

8. **Output Node**
   - Output the combined knowledge tree as agent-ready JSON or navigable Markdown, including direct URLs for deeper lookup.

---

## Example Output Structure

```

{
"project": "Sample Software",
"summary": "A brief summary of the software project goes here.",
"sections": [
{
"name": "Getting Started",
"links": [
{
"title": "Installation",
"url": "https://example.com/docs/install",
"description": "How to install the software.",
"headings": ["Introduction", "Requirements", "Steps"]
},
{
"title": "Quick Start",
"url": "https://example.com/docs/quickstart",
"description": "Hands-on usage guide.",
"headings": ["Run Demo", "Configuration"]
}
]
},
{
"name": "API Reference",
"links": [
{
"title": "REST API",
"url": "https://example.com/docs/api",
"description": "List of available API endpoints.",
"headings": ["Authentication", "Endpoints", "Error Codes"]
}
]
}
]
}

```

---

## Notes

- If `/llms-full.txt` exists, it may provide extended content in the same navigable structure [web:13].
- This approach is efficient, agent-friendly, and benefits from any manual curation provided by the documentation authors [web:11][web:12][web:16].
- Can be fully automated using n8n standard nodes (HTTP Request, Code, HTML Extract, Merge), and optionally extended with AI summarization as needed [web:17].
