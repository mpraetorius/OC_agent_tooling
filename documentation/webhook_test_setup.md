# Webhook Test Documentation

## Overview
This document outlines the correct setup and testing procedure for the n8n webhook endpoint used in the docs_develop_llms workflow.

## Webhook Endpoint
- **URL**: `https://webhooks.prenzler.xyz/webhook-test/docs_develop_llms`
- **Method**: POST
- **Content-Type**: application/json

## Test Payload
The webhook expects the following JSON structure in the request body:

```json
{
  "llmsTxtUrl": "https://www.langflow.org/llms.txt",
  "domain": "langflow.org", 
  "timestamp": "2025-12-02T10:30:00.000Z",
  "outputPath": "documentation/langflow.org_summary.md",
  "requestedBy": "docs_develop_llms_tool"
}
```

## Expected Response
The n8n webhook should return the following JSON with properly resolved template variables:

```json
{
  "status": "success",
  "received_domain": "{{ $json.body.domain }}",
  "received_url": "{{ $json.body.llmsTxtUrl }}"
}
```

Which resolves to:
```json
{
  "status": "success",
  "received_domain": "langflow.org",
  "received_url": "https://www.langflow.org/llms.txt"
}
```

## Testing Procedure

### Option 1: Using JSON File (Recommended)
1. Create a payload file `webhook_payload.json`:
   ```json
   {
     "llmsTxtUrl": "https://www.langflow.org/llms.txt",
     "domain": "langflow.org", 
     "timestamp": "2025-12-02T10:30:00.000Z",
     "outputPath": "documentation/langflow.org_summary.md",
     "requestedBy": "docs_develop_llms_tool"
   }
   ```

2. Execute the curl command:
   ```bash
   curl -X POST "https://webhooks.prenzler.xyz/webhook-test/docs_develop_llms" \
        -H "Content-Type: application/json" \
        -d @webhook_payload.json
   ```

### Option 2: Direct JSON Payload
```bash
curl -X POST "https://webhooks.prenzler.xyz/webhook-test/docs_develop_llms" \
     -H "Content-Type: application/json" \
     -d '{"llmsTxtUrl": "https://www.langflow.org/llms.txt", "domain": "langflow.org", "timestamp": "2025-12-02T10:30:00.000Z", "outputPath": "documentation/langflow.org_summary.md", "requestedBy": "docs_develop_llms_tool"}'
```

## Critical n8n Configuration Notes

### Webhook Response Node Setup
The correct JSON syntax for the n8n webhook response node is:

```json
{
  "status": "success",
  "received_domain": "{{ $json.body.domain }}",
  "received_url": "{{ $json.body.llmsTxtUrl }}"
}
```

**Important**: Use `{{ $json.body.field_name }}` syntax to access JSON body fields, not `{{ .field_name }}`.

### Common Issues & Solutions

1. **JSON Parsing Errors**: Ensure proper quoting and escaping in curl commands
2. **Template Variable Resolution**: Verify n8n template syntax uses `$json.body.field_name`
3. **Content-Type Header**: Must be set to `application/json`
4. **HTTP Method**: Must be POST for webhook to receive payload

## Success Indicators
- HTTP Response Code: 200 OK
- Response contains resolved domain and URL values
- Status field returns "success"

## Last Tested
- **Date**: 2025-12-02
- **Status**: ✅ Working correctly
- **Response Time**: < 1 second