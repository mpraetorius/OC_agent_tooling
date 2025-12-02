# n8n Workflow Specification: docs_develop_llms

## Overview

This n8n workflow implements the hybrid approach for documentation development using llms.txt files combined with selective detail fetching. The workflow generates structured documentation summaries for coding agents by leveraging site-provided llms.txt navigation and selectively crawling key documentation pages for additional detail.

**Primary Purpose:** Create agent-ready documentation that provides both high-level navigation and detailed heading hierarchies for effective software package understanding.

## Input Requirements

### JSON Schema
```json
{
  "type": "object",
  "properties": {
    "llms_txt_url": {
      "type": "string",
      "format": "uri",
      "description": "URL to the llms.txt file (e.g., https://www.langflow.org/llms.txt)"
    },
    "focus_areas": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Optional array of focus areas for selective processing",
      "default": []
    },
    "output_file": {
      "type": "string",
      "description": "Output file path for generated documentation"
    }
  },
  "required": ["llms_txt_url", "output_file"]
}
```

### Example Input
```json
{
  "llms_txt_url": "https://www.langflow.org/llms.txt",
  "focus_areas": ["architecture", "API design"],
  "output_file": "documentation/developed_docs.md"
}
```

## Output Requirements

### Response Format
```json
{
  "success": boolean,
  "timestamp": "ISO 8601 datetime",
  "statusCode": number,
  "response": {
    "documentation_file": "string",
    "sources_processed": number,
    "domains_found": ["string"],
    "focus_areas_covered": ["string"],
    "processing_time_seconds": number,
    "project_summary": {
      "name": "string",
      "description": "string",
      "sections": [
        {
          "name": "string",
          "pages": [
            {
              "title": "string",
              "url": "string",
              "description": "string",
              "headings": ["string"]
            }
          ]
        }
      ]
    }
  }
}
```

### Success Response Example
```json
{
  "success": true,
  "timestamp": "2025-12-02T12:00:00Z",
  "statusCode": 200,
  "response": {
    "documentation_file": "documentation/developed_docs.md",
    "sources_processed": 5,
    "domains_found": ["langflow.org", "docs.langflow.org"],
    "focus_areas_covered": ["architecture", "API design"],
    "processing_time_seconds": 45,
    "project_summary": {
      "name": "LangFlow",
      "description": "A UI-based way to design and execute multi-agent and LLM flows",
      "sections": [
        {
          "name": "Getting Started",
          "pages": [
            {
              "title": "Installation",
              "url": "https://docs.langflow.org/installation",
              "description": "How to install LangFlow",
              "headings": ["Prerequisites", "Installation Methods", "Configuration"]
            }
          ]
        }
      ]
    }
  }
}
```

## Processing Steps

### Step 1: Fetch llms.txt
- **HTTP Request Node**: GET request to the provided llms_txt_url
- **Validation**: Verify response is valid markdown and contains expected structure
- **Error Handling**: Return 404 if file not accessible, 400 if malformed

### Step 2: Parse llms.txt Structure
- **Code Node**: Extract H1 project name and summary blockquote
- **Code Node**: Identify section headers (H2: `## Section Name`)
- **Code Node**: Parse markdown lists for page links and descriptions
- **Output**: Structured JSON representing navigation hierarchy

### Step 3: Prioritize Key Pages
- **Filter Node**: Apply keyword-based prioritization
- **Priority Keywords**: "Getting Started", "Installation", "API Reference", "Configuration", "Architecture", "Examples"
- **Focus Areas Matching**: Cross-reference with user-provided focus_areas
- **Scoring**: Assign priority scores for selective fetching

### Step 4: Selective Detail Fetching
- **Batch HTTP Request Nodes**: Fetch high-priority pages only
- **HTML Extract Nodes**: Extract heading hierarchy (h1, h2, h3, ...) from each page
- **Content Validation**: Ensure pages contain meaningful heading structure
- **Timeout Handling**: 30-second timeout per page request

### Step 5: Merge and Structure
- **Merge Node**: Combine llms.txt navigation with extracted heading trees
- **Code Node**: Create unified JSON structure with both overview and detail
- **Optional AI Node**: Generate enhanced summaries if needed (timeout: 60s)

### Step 6: Output Generation
- **File Write Node**: Save structured Markdown documentation
- **Response Node**: Return JSON response with processing metadata
- **Cleanup**: Remove temporary files and data

## Error Handling

### Required Error Responses

#### 1. Invalid URL
```json
{
  "success": false,
  "timestamp": "2025-12-02T12:00:00Z",
  "statusCode": 400,
  "error": "Invalid llms.txt URL provided",
  "details": "URL must be a valid HTTP/HTTPS URL pointing to an llms.txt file"
}
```

#### 2. Missing Output File
```json
{
  "success": false,
  "timestamp": "2025-12-02T12:00:00Z",
  "statusCode": 400,
  "error": "Missing output_file parameter",
  "details": "Output file path is required and must be provided"
}
```

#### 3. File Not Found
```json
{
  "success": false,
  "timestamp": "2025-12-02T12:00:00Z",
  "statusCode": 404,
  "error": "llms.txt file not found",
  "details": "The specified URL does not exist or is not accessible"
}
```

#### 4. Parse Error
```json
{
  "success": false,
  "timestamp": "2025-12-02T12:00:00Z",
  "statusCode": 422,
  "error": "Unable to parse llms.txt file",
  "details": "File does not conform to expected llms.txt format"
}
```

#### 5. Processing Timeout
```json
{
  "success": false,
  "timestamp": "2025-12-02T12:00:00Z",
  "statusCode": 408,
  "error": "Processing timeout exceeded",
  "details": "Documentation processing exceeded maximum time limit (300 seconds)"
}
```

### Retry Logic
- Network requests: 3 retries with 5-second exponential backoff
- Processing failures: Immediate return with detailed error message
- Timeout protection: Global 300-second timeout for entire workflow

## Integration Details

### Webhook Configuration
- **Webhook URL**: https://webhooks.prenzler.xyz/webhook/docs_develop_llms
- **Method**: POST
- **Content-Type**: application/json
- **Authentication**: None (public endpoint)

### Timeout Settings
- **HTTP Requests**: 30 seconds per request
- **AI Processing**: 60 seconds (if used)
- **Total Workflow**: 300 seconds maximum
- **Retry Delay**: 5 seconds (exponential backoff)

### Resource Limits
- **Max Pages Processed**: 20 pages (configurable)
- **Max Concurrent Requests**: 5 parallel requests
- **Memory Usage**: Limited to 512MB for processing
- **File Size**: Max 10MB for generated documentation

### Logging and Monitoring
- **Request Logging**: Log all incoming requests with timestamps
- **Error Tracking**: Detailed error logging with stack traces
- **Performance Metrics**: Track processing times and success rates
- **Usage Analytics**: Monitor frequently requested domains

## Test Case

### Test Data: https://www.langflow.org/llms.txt

#### Expected Input
```json
{
  "llms_txt_url": "https://www.langflow.org/llms.txt",
  "focus_areas": ["getting started", "components"],
  "output_file": "documentation/langflow_docs.md"
}
```

#### Expected Processing Flow
1. **Fetch**: Successfully retrieve langflow.org/llms.txt
2. **Parse**: Extract "LangFlow" as project name and summary
3. **Prioritize**: Identify "Getting Started" and "Components" sections as high priority
4. **Fetch Details**: Retrieve key pages like installation and component documentation
5. **Extract**: Parse heading hierarchies from each page
6. **Merge**: Create unified documentation structure
7. **Output**: Generate Markdown file with navigation and details

#### Expected Output Structure
- Project name: "LangFlow"
- Sections: Getting Started, Components, API Reference, etc.
- Page details with heading hierarchies
- Processing metadata including domains and timing

#### Validation Criteria
- ✅ Successfully parses llms.txt format
- ✅ Extracts project name and summary correctly
- ✅ Identifies and prioritizes relevant sections
- ✅ Fetches selective page content efficiently
- ✅ Generates structured output with both overview and detail
- ✅ Completes processing within timeout limits
- ✅ Handles network errors gracefully
- ✅ Requires and validates output_file parameter

## Implementation Notes

### Best Practices
- Always validate URLs before processing
- Implement proper timeout handling for all network operations
- Use structured error messages for debugging
- Log all processing steps for audit trails
- Respect rate limits when crawling documentation sites

### Extension Points
- **Custom Prioritization**: Add configurable priority rules based on user needs
- **AI Enhancement**: Integrate LLM summarization for complex documentation
- **Multi-language Support**: Extend to handle non-English documentation
- **Caching**: Implement caching for frequently accessed documentation sites

### Maintenance Considerations
- Regular monitoring of webhook endpoint performance
- Updates to parsing logic as llms.txt standard evolves
- Periodic review of priority keywords and scoring algorithms
- Updates to handle new documentation site structures