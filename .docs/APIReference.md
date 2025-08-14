# Buddhi Flow - API Reference

## Browser Use Cloud API Integration

This document provides a comprehensive reference for the Browser Use Cloud API endpoints integrated with Buddhi Flow.

## 1. Authentication

All API requests require authentication using an API key.

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
```

## 2. Task Management

### 2.1 Run Task

Creates a new browser automation task and returns the task ID for tracking progress.

**Endpoint:** `POST /api/v1/run-task`

**Request Body:**
```json
{
  "task": "Instructions for what the agent should do",
  "secrets": {
    "username": "user123",
    "password": "securepassword"
  },
  "allowed_domains": ["google.com", "amazon.com", ".skyscanner.com"],
  "browser_profile_id": "profile-123",
  "save_browser_data": false,
  "structured_output_json": "JSON schema for structured output",
  "llm_model": "gpt-4o",
  "use_adblock": true,
  "use_proxy": true,
  "proxy_country_code": "us",
  "highlight_elements": true,
  "included_file_names": ["file1.txt", "file2.csv"],
  "browser_viewport_width": 1280,
  "browser_viewport_height": 960,
  "max_agent_steps": 75,
  "enable_public_share": false,
  "metadata": {
    "campaign": "q4-automation",
    "team": "marketing"
  }
}
```

**Response:**
```json
{
  "id": "task-123"
}
```

### 2.2 Get Task Status

Retrieves the status and details of a specific task.

**Endpoint:** `GET /api/v1/tasks/{id}`

**Response:**
```json
{
  "id": "task-123",
  "status": "running",
  "created_at": "2024-06-01T12:00:00Z",
  "updated_at": "2024-06-01T12:05:00Z",
  "task": "Instructions for what the agent should do",
  "steps": [
    {
      "step_id": 1,
      "type": "navigation",
      "status": "completed",
      "url": "https://example.com",
      "timestamp": "2024-06-01T12:01:00Z"
    }
  ]
}
```

### 2.3 List Tasks

Retrieves a list of tasks with optional filtering.

**Endpoint:** `GET /api/v1/tasks`

**Query Parameters:**
- `limit`: Maximum number of tasks to return (default: 10)
- `offset`: Number of tasks to skip (default: 0)
- `status`: Filter by task status (e.g., "running", "finished")
- `from_date`: Filter tasks created after this date
- `to_date`: Filter tasks created before this date

**Response:**
```json
{
  "tasks": [
    {
      "id": "task-123",
      "status": "running",
      "created_at": "2024-06-01T12:00:00Z",
      "task": "Instructions for what the agent should do"
    }
  ],
  "total": 100,
  "limit": 10,
  "offset": 0
}
```

## 3. Scheduled Tasks

### 3.1 Create Scheduled Task

Creates a new scheduled task to run at regular intervals or based on a cron expression.

**Endpoint:** `POST /api/v1/scheduled-task`

**Request Body:**
```json
{
  "task": "Instructions for what the agent should do",
  "schedule_type": "interval",
  "interval_minutes": 60,
  "start_at": "2024-06-01T00:00:00Z",
  "end_at": "2024-12-31T23:59:59Z",
  "secrets": {
    "username": "user123",
    "password": "securepassword"
  },
  "allowed_domains": ["google.com", "amazon.com"],
  "save_browser_data": false,
  "structured_output_json": "JSON schema for structured output",
  "llm_model": "gpt-4o",
  "use_adblock": true,
  "use_proxy": true,
  "proxy_country_code": "us",
  "highlight_elements": true,
  "browser_viewport_width": 1280,
  "browser_viewport_height": 960,
  "max_agent_steps": 75,
  "enable_public_share": false,
  "metadata": {
    "campaign": "q4-automation",
    "team": "marketing"
  }
}
```

**Response:**
```json
{
  "id": "scheduled-task-123",
  "next_run_at": "2024-06-01T01:00:00Z"
}
```

### 3.2 List Scheduled Tasks

Retrieves a list of scheduled tasks.

**Endpoint:** `GET /api/v1/scheduled-tasks`

**Query Parameters:**
- `limit`: Maximum number of tasks to return (default: 10)
- `offset`: Number of tasks to skip (default: 0)
- `active`: Filter by active status (true/false)

**Response:**
```json
{
  "scheduled_tasks": [
    {
      "id": "scheduled-task-123",
      "task": "Instructions for what the agent should do",
      "schedule_type": "interval",
      "interval_minutes": 60,
      "start_at": "2024-06-01T00:00:00Z",
      "end_at": "2024-12-31T23:59:59Z",
      "active": true,
      "next_run_at": "2024-06-01T01:00:00Z"
    }
  ],
  "total": 5,
  "limit": 10,
  "offset": 0
}
```

### 3.3 Update Scheduled Task

Updates an existing scheduled task.

**Endpoint:** `PUT /api/v1/scheduled-tasks/{id}`

**Request Body:**
```json
{
  "task": "Updated instructions for what the agent should do",
  "interval_minutes": 120,
  "active": false
}
```

**Response:**
```json
{
  "id": "scheduled-task-123",
  "task": "Updated instructions for what the agent should do",
  "schedule_type": "interval",
  "interval_minutes": 120,
  "active": false,
  "next_run_at": null
}
```

### 3.4 Delete Scheduled Task

Deletes a scheduled task.

**Endpoint:** `DELETE /api/v1/scheduled-tasks/{id}`

**Response:**
```json
{
  "success": true
}
```

## 4. Browser Profiles

### 4.1 Create Browser Profile

Creates a new browser profile.

**Endpoint:** `POST /api/browser-profiles`

**Request Body:**
```json
{
  "name": "My Profile",
  "description": "Profile for e-commerce automation",
  "viewportWidth": 1280,
  "viewportHeight": 960,
  "useAdblock": true,
  "useProxy": true,
  "proxyCountryCode": "us",
  "saveBrowserData": false
}
```

**Response:**
```json
{
  "id": "profile-123",
  "name": "My Profile",
  "description": "Profile for e-commerce automation",
  "viewportWidth": 1280,
  "viewportHeight": 960,
  "useAdblock": true,
  "useProxy": true,
  "proxyCountryCode": "us",
  "saveBrowserData": false,
  "createdAt": "2024-06-01T12:00:00Z",
  "updatedAt": "2024-06-01T12:00:00Z"
}
```

### 4.2 List Browser Profiles

Retrieves a list of browser profiles.

**Endpoint:** `GET /api/browser-profiles`

**Query Parameters:**
- `limit`: Maximum number of profiles to return (default: 10)
- `offset`: Number of profiles to skip (default: 0)

**Response:**
```json
{
  "profiles": [
    {
      "id": "profile-123",
      "name": "My Profile",
      "description": "Profile for e-commerce automation",
      "viewportWidth": 1280,
      "viewportHeight": 960,
      "useAdblock": true,
      "useProxy": true,
      "proxyCountryCode": "us",
      "saveBrowserData": false,
      "createdAt": "2024-06-01T12:00:00Z",
      "updatedAt": "2024-06-01T12:00:00Z"
    }
  ],
  "total": 5,
  "limit": 10,
  "offset": 0
}
```

### 4.3 Update Browser Profile

Updates an existing browser profile.

**Endpoint:** `PUT /api/browser-profiles/{id}`

**Request Body:**
```json
{
  "name": "Updated Profile Name",
  "viewportWidth": 1920,
  "viewportHeight": 1080
}
```

**Response:**
```json
{
  "id": "profile-123",
  "name": "Updated Profile Name",
  "description": "Profile for e-commerce automation",
  "viewportWidth": 1920,
  "viewportHeight": 1080,
  "useAdblock": true,
  "useProxy": true,
  "proxyCountryCode": "us",
  "saveBrowserData": false,
  "createdAt": "2024-06-01T12:00:00Z",
  "updatedAt": "2024-06-01T12:05:00Z"
}
```

### 4.4 Delete Browser Profile

Deletes a browser profile.

**Endpoint:** `DELETE /api/browser-profiles/{id}`

**Response:**
```json
{
  "success": true
}
```

## 5. Webhooks

### 5.1 Webhook Events

Browser Use sends various types of events via webhooks. Each event has a specific type and payload structure.

**Event Types:**
- `agent.task.status_update`: Status updates for running tasks

**Task Status Updates:**
- `initializing`: A task is initializing
- `started`: A task has started (browser available)
- `paused`: A task has been paused mid-execution
- `stopped`: A task has been stopped mid-execution
- `finished`: A task has finished

### 5.2 Webhook Payload Structure

Each webhook call includes:
- A JSON payload with event details
- `X-Browser-Use-Timestamp` header with the current timestamp
- `X-Browser-Use-Signature` header for verification

**Example Payload:**
```json
{
  "type": "agent.task.status_update",
  "timestamp": "2024-06-01T09:22:22.269116+00:00",
  "payload": {
    "session_id": "cd9cc7bf-e3af-4181-80a2-73f083bc94b4",
    "task_id": "5b73fb3f-a3cb-4912-be40-17ce9e9e1a45",
    "status": "finished",
    "metadata": {
      "campaign": "q4-automation",
      "team": "marketing"
    }
  }
}
```

### 5.3 Webhook Verification

To ensure webhook authenticity, you must verify the signature using the following algorithm:

```python
import hmac
import hashlib
import json

def verify_signature(payload, timestamp, received_signature, secret_key):
    message = f'{timestamp}.{json.dumps(payload, separators=(",", ":"), sort_keys=True)}'
    expected_signature = hmac.new(secret_key.encode(), message.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected_signature, received_signature)
```

## 6. Error Handling

### 6.1 Error Responses

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": {
      "field": "task",
      "issue": "Task instructions cannot be empty"
    }
  }
}
```

### 6.2 Common Error Codes

- `authentication_error`: Invalid or missing API key
- `invalid_request`: Malformed request or invalid parameters
- `not_found`: Requested resource not found
- `rate_limit_exceeded`: Too many requests
- `server_error`: Internal server error 