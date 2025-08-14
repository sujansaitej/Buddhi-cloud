### **Cloud API v1 Webhooks**

Learn how to integrate webhooks with Browser Use Cloud API

Webhooks allow you to receive real-time notifications about events in your Browser Use tasks. This guide will show you how to set up and verify webhook endpoints.

## **Prerequisites**

You need an active subscription to create webhooks. See your billing page [**cloud.browser-use.com/billing**](https://cloud.browser-use.com/billing)

## **Setting Up Webhooks**

To receive webhook notifications, you need to:

1. Create an endpoint that can receive HTTPS POST requests
2. Configure your webhook URL in the Browser Use dashboard
3. Implement signature verification to ensure webhook authenticity

When adding a webhook URL in the dashboard, it must be a valid HTTPS URL that can receive POST requests. On creation, we will send a test payload **`{"type": "test", "timestamp": "2024-03-21T12:00:00Z", "payload": {"test": "ok"}}`** to verify the endpoint is working correctly before creating the actual webhook!

## **Webhook Events**

Browser Use sends various types of events. Each event has a specific type and payload structure.

### **Event Types**

Currently supported events:

| **Event Type** | **Description** |
| --- | --- |
| **`agent.task.status_update`** | Status updates for running tasks |

### **Task Status Updates**

The `agent.task.status_update` event includes the following statuses:

| **Status** | **Description** |
| --- | --- |
| **`initializing`** | A task is initializing |
| **`started`** | A Task has started (browser available) |
| **`paused`** | A task has been paused mid execution |
| **`stopped`** | A task has been stopped mid execution |
| **`finished`** | A task has finished |

## **Webhook Payload Structure**

Each webhook call includes:

- A JSON payload with event details
- **`X-Browser-Use-Timestamp`** header with the current timestamp
- **`X-Browser-Use-Signature`** header for verification

The payload follows this structure:

```json
{
  "type": "agent.task.status_update",
  "timestamp": "2025-05-25T09:22:22.269116+00:00",
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

The webhook payload now includes a `metadata` field containing any custom key-value pairs that were provided when the task was created. This allows you to correlate webhook events with your internal tracking systems.

## **Implementing Webhook Verification**

To ensure webhook authenticity, you must verify the signature. Here’s an example implementation in Python using FastAPI:

```python
import uvicorn
import hmac
import hashlib
import json
import os
from fastapi import FastAPI, Request, HTTPException

app = FastAPI()
SECRET_KEY = os.environ['SECRET_KEY']

def verify_signature(payload: dict, timestamp: str, received_signature: str) -> bool:
    message = f'{timestamp}.{json.dumps(payload, separators=(",", ":"), sort_keys=True)}'
    expected_signature = hmac.new(SECRET_KEY.encode(), message.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected_signature, received_signature)

@app.post('/webhook')
async def webhook(request: Request):
    body = await request.json()
    timestamp = request.headers.get('X-Browser-Use-Timestamp')
    signature = request.headers.get('X-Browser-Use-Signature')
    
    if not timestamp or not signature:
        raise HTTPException(status_code=400, detail='Missing timestamp or signature')
    
    if not verify_signature(body, timestamp, signature):
        raise HTTPException(status_code=403, detail='Invalid signature')
    
    # Handle different event types
    event_type = body.get('type')
    if event_type == 'agent.task.status_update':
        # Handle task status update
        print('Task status update received:', body['payload'])
    elif event_type == 'test':
        # Handle test webhook
        print('Test webhook received:', body['payload'])
    else:
        print('Unknown event type:', event_type)
    
    return {'status': 'success', 'message': 'Webhook received'}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8080)
```

## **Best Practices**

1. **Always verify signatures**: Never process webhook payloads without verifying the signature
2. **Handle retries**: Browser Use will retry failed webhook deliveries up to 5 times
3. **Respond quickly**: Return a 200 response as soon as you’ve verified the signature
4. **Process asynchronously**: Handle the webhook payload processing in a background task
5. **Monitor failures**: Set up monitoring for webhook delivery failures
6. **Handle unknown events**: Implement graceful handling of new event types that may be added in the future

### **Search API - Simple Search**

Search Google and extract relevant content from multiple top results

**POST** `/api/v1/simple-search`

**Try it**

## **Overview**

Search and extract content from multiple websites in real-time. Gets live data by actually visiting sites, not cached results.

💡 **Complete working example**: [**simple_search.py**](https://github.com/browser-use/browser-use/blob/main/examples/search/simple_search.py)

## **Request**

**query**

**stringrequired**

The search query to process

**max_websites**

**integerdefault:"5"**

Maximum number of websites to process from search results (1-10)

**depth**

**integerdefault:"2"**

How deep to navigate within each website (2-5). Higher depth = more thorough exploration through multiple page clicks.

## **Response**

**results**

**array**

Array of results from processed websites
Show result object

## **Pricing**

**Cost per request**: `1 cent × depth × max_websites`

Examples:
- depth=2, max_websites=5 = 10 cents per request (default values)
- depth=2, max_websites=3 = 6 cents per request
- depth=3, max_websites=2 = 6 cents per request

### **Search API - Search URL**

Extract specific content from a given URL using AI

**POST** `/api/v1/search-url`

**Try it**

## **Overview**

Extract content from a specific website by navigating it in real-time. Clicks through pages to find exactly what you need.

💡 **Complete working example**: [**search_url.py**](https://github.com/browser-use/browser-use/blob/main/examples/search/search_url.py)

## **Request**

**url**

**stringrequired**

The URL to extract content from

**query**

**stringrequired**

What specific content to look for and extract from the URL

**depth**

**integerdefault:"2"**

How deep to navigate within the website (2-5). Higher depth = more thorough exploration through multiple page clicks.

## **Response**

**url**

**string**

The URL that was processed

**content**

**string**

Extracted content relevant to the search query

## **Example**

## **Pricing**

**Cost per request**: `1 cent × depth`

Examples:
- depth=2 = 2 cents per request (default value)
- depth=3 = 3 cents per request
- depth=4 = 4 cents per request
- depth=5 = 5 cents per request

### **Tasks API - Run Task**

Requires an active subscription. Returns the task ID that can be used to track progress.

**POST** `/api/v1/run-task`

**Try it**

Creates a new browser automation task and returns the task ID that can be used to track progress.

## **Request Body**

**task**

**stringrequired**

Instructions for what the agent should do. You can try it out at [**https://cloud.browser-use.com/**](https://cloud.browser-use.com/)

**secrets**

**object**

Dictionary of secrets to be used by the agent. Secrets are safely encrypted before storing in the database.

**allowed_domains**

**array**

List of domains that the agent is allowed to visit (e.g. [“google.com”, “amazon.com”, “*.skyscanner.com”]).We recommend using a wildcard to allow all subdomains of a domain (e.g. “*.skyscanner.com”).If not set, the agent will be allowed to visit all domains (not recommended if you are using secrets).

**browser_profile_id**

**string**

ID of the browser profile to use. If not set, the default profile will be used.

**save_browser_data**

**booleandefault:"false"**

If set to True, the browser cookies and other data will be saved. Cookies are safely encrypted before storing in the database.

**structured_output_json**

**string**

If set, the agent will use this JSON schema as the output model (see example here: [**https://docs.browser-use.com/cloud/implementation#structured-output-example**](https://docs.browser-use.com/cloud/implementation#structured-output-example)).

**llm_model**

**stringdefault:"gpt-4.1"**

LLM model to use. Available options:

- gpt-4o
- gpt-4o-mini
- gpt-4.1
- gpt-4.1-mini
- gemini-2.5-flash
- claude-sonnet-4-20250514

**use_adblock**

**booleandefault:"true"**

If set to True, the agent will use an adblocker.

**use_proxy**

**booleandefault:"true"**

If set to True, the agent will use a (mobile) proxy. Note that proxy is required for captcha solving, so if you disable proxy, you will not be able to solve captchas.

**proxy_country_code**

**stringdefault:"us"**

Country code for residential proxy. Must be one of: ‘us’, ‘fr’, ‘it’, ‘jp’, ‘au’, ‘de’, ‘fi’, ‘ca’. Default is ‘us’.

**highlight_elements**

**booleandefault:"true"**

If set to True, the agent will highlight the elements on the page.

**included_file_names**

**array**

File names to include in the task (note: use uploads/presigned-url endpoint to upload the files first!). E.g. [‘file1.txt’, ‘file2.csv’]

**browser_viewport_width**

**integerdefault:"1280"**

Width of the browser viewport in pixels. Default is 1280.

**browser_viewport_height**

**integerdefault:"960"**

Height of the browser viewport in pixels. Default is 960.

**max_agent_steps**

**integerdefault:"75"**

Maximum number of agent steps to take. Default is 75. Maximum is 200.

**enable_public_share**

**booleandefault:"false"**

If set to True, enables public sharing of the task execution. When enabled, a public_share_url will be generated that allows others to view the task results without authentication.

**metadata**

**object**

Optional dictionary of string key-value pairs for custom tagging. Max 10 pairs. Keys: strings (max 100 chars, non-empty). Values: strings (max 1000 chars).

## **Response**

**id**

**string**

The unique identifier for the created task.

### **Tasks API - Stop Task**

Stops a running browser automation task immediately.

**PUT** `/api/v1/stop-task`

**Try it**

Stops a running browser automation task immediately. The task cannot be resumed after being stopped. Use `/pause-task` endpoint instead if you want to temporarily halt execution.

## **Parameters**

**task_id**

**stringrequired**

ID of the task to stop

## **Response**

The endpoint returns an empty response body with a 200 status code on success.

## **Usage Notes**

- Once a task is stopped, it cannot be resumed
- The task status will change to “stopped”
- Any ongoing browser automation will be immediately terminated
- Use the pause endpoint if you need to temporarily halt execution with the ability to resume later

Stopping a task is irreversible. If you need to pause execution temporarily, use the **`/pause-task`** endpoint instead.

### **Pause Task**

Pauses execution of a running task

**PUT** `/api/v1/pause-task`

**Try it**

Pauses execution of a running task. The task can be resumed later using the `/resume-task` endpoint. Useful for manual intervention or inspection.

## **Parameters**

**task_id**

**stringrequired**

ID of the task to pause

## **Response**

The endpoint returns an empty response body with a 200 status code on success.

## **Usage Notes**

- Paused tasks can be resumed using the **`/resume-task`** endpoint
- The task status will change to “paused”
- Browser automation will be temporarily halted
- Useful for manual intervention or inspection during task execution

Pausing is useful when you need to temporarily halt execution to inspect the current state or make manual adjustments before resuming.

### **Tasks API - Resume Task**

Resumes execution of a previously paused task

**PUT** `/api/v1/resume-task`

**Try it**

Resumes execution of a previously paused task. The task will continue from where it was paused. You can’t resume a stopped task.

## **Parameters**

**task_id**

**stringrequired**

ID of the task to resume

## **Response**

The endpoint returns an empty response body with a 200 status code on success.

## **Usage Notes**

- Only paused tasks can be resumed
- The task status will change from “paused” to “running”
- Browser automation will continue from where it was paused
- Stopped tasks cannot be resumed - you must create a new task instead

You cannot resume a task that has been stopped. Only paused tasks can be resumed.

### **Tasks API - Get Task**

Get comprehensive information about a task

**GET** `/api/v1/task/{task_id}`

**Try it**

Returns comprehensive information about a task, including its current status, steps completed, output, and other metadata.

## **Path Parameters**

**task_id**

**stringrequired**

ID of the task to retrieve

## **Response**

**id**

**stringrequired**

The unique identifier for the task

**task**

**stringrequired**

The original task instructions

**output**

**string | nullrequired**

The final output or result from the task (if completed)

**status**

**enum<string>required**

Enumeration of possible task states.

- created: Task is initialized but not yet started
- running: Task is currently executing
- finished: Task has completed successfully
- stopped: Task was manually stopped
- paused: Task execution is temporarily paused
- failed: Task encountered an error and could not complete

Available options:

```
created
```

,

```
running
```

,

```
finished
```

,

```
stopped
```

,

```
paused
```

,

```
failed
```

**created_at**

**stringrequired**

ISO 8601 timestamp of when the task was created

**steps**

**TaskStepResponse · object[]required**

List of task steps with execution details
Show Hide child attributes

**live_url**

**string | null**

URL to view live task execution. To preview the url you can directly integrate it in **`<iframe>`** tag. For example: **`<iframe src={live_url} width="600" height="450"></iframe>`** Which will display the task execution and allows you to control the agent live. It is pure VNC implementation.

**finished_at**

**string | null**

ISO 8601 timestamp of when the task finished (if completed)

**browser_data**

**object | null**

Browser session data (if save_browser_data was enabled)This field is only available if save_browser_data is set to True in the request.
Show Hide child attributes

**user_uploaded_files**

**string[] | null**

List of files uploaded by the user for this task

**output_files**

**string[] | null**

List of files generated during task execution

**public_share_url**

**string | null**

Public URL for sharing the task (if public sharing was enabled)

**metadata**

**object | null**

Custom metadata key-value pairs associated with the task

### **Tasks API - Get Task Status**

Get the current status of a task

**GET** `/api/v1/task/{task_id}/status`

**Try it**

Returns just the current status of a task (created, running, finished, stopped, paused, or failed). This is more lightweight than the full task details endpoint.

## **Path Parameters**

**task_id**

**stringrequired**

ID of the task to check status for

## **Response**

The endpoint returns the status as a simple string value (not wrapped in an object).

## **Status Values**

The status field can have one of the following values:

- **`created`**: Task is initialized but not yet started
- **`running`**: Task is currently executing
- **`finished`**: Task has completed successfully
- **`stopped`**: Task was manually stopped
- **`paused`**: Task execution is temporarily paused
- **`failed`**: Task encountered an error and could not complete

## **Use Cases**

This endpoint is useful for:

- Polling task status without retrieving full task details
- Lightweight status checks in monitoring applications
- Quick status verification before making other API calls
- Building real-time dashboards with minimal data transfer

Use this endpoint instead of the full task details endpoint when you only need to check the current status, as it’s much faster and uses less bandwidth.

### **Tasks API - List Tasks**

Get a paginated list of all tasks

**GET** `/api/v1/tasks`

**Try it**

Returns a paginated list of all tasks belonging to the user, ordered by creation date. Each task includes basic information like status and creation time. For detailed task info, use the get task endpoint.

**page**

**integerdefault:"1"**

Page number (minimum: 1)

**limit**

**integerdefault:"10"**

Number of items per page (minimum: 1)

**tasks**

**array**

List of simplified task objects

**id**

**string**

Unique identifier for the task

**task**

**string**

Original task instructions

**output**

**string**

Final output or result from the task

**status**

**string**

Current status of the task

**created_at**

**string**

ISO 8601 timestamp of task creation

**finished_at**

**string**

ISO 8601 timestamp of task completion

**live_url**

**string**

URL to view live task execution

**total_pages**

**integer**

Total number of pages available

**page**

**integer**

Current page number

**limit**

**integer**

Number of items per page

**total_count**

**integer**

Total number of tasks across all pages

## **Pagination**

The API uses offset-based pagination:

- **page**: Start from page 1
- **limit**: Maximum 100 items per page
- **total_pages**: Use this to implement pagination UI
- **total_count**: Total number of tasks across all pages

## **Ordering**

Tasks are ordered by creation date (newest first). This ensures that recently created tasks appear at the top of the list.

## **Use Cases**

This endpoint is useful for:

- Building task management dashboards
- Monitoring task execution status
- Filtering tasks by status
- Implementing task history views

This endpoint returns simplified task objects for performance. Use the individual task endpoint to get complete task details including steps and browser data.

### **Tasks API - Get Task Media**

Get media files generated during task execution

**GET** `/api/v1/task/{task_id}/media`

**Try it**

Returns links to any recordings or media generated during task execution, such as browser session recordings. Only available for completed tasks.

**task_id**

**stringrequired**

ID of the task to retrieve media for

**recordings**

**array**

List of recording URLs generated during task execution

## **Media Types**

The following types of media files may be generated:

- **Session recordings**: Full browser session recordings in MP4 format
- **Screen recordings**: Screen capture videos in WebM format
- **Audio recordings**: Audio tracks if microphone access was used

## **Availability**

- Media files are only available for completed tasks
- Recordings are generated automatically during task execution
- Files are available for download for 30 days after task completion
- Media generation can be disabled in task settings to save storage

Media files are only generated for tasks that have been configured to record sessions. This feature may not be available for all task types.

### **Tasks API - Get Task Screenshots**

Get screenshots generated during task execution

**GET** `/api/v1/task/{task_id}/screenshots`

**Try it**

Returns any screenshot URLs generated during task execution. Screenshots are automatically captured at key moments during the automation process.

**task_id**

**stringrequired**

ID of the task to retrieve screenshots for

**screenshots**

**array**

List of screenshot URLs generated during task execution

## **Screenshot Details**

Screenshots are captured automatically during task execution:

- **Step-by-step captures**: Screenshots taken at each major step
- **Error captures**: Screenshots captured when errors occur
- **Final result**: Screenshot of the final state when task completes
- **High resolution**: Screenshots are captured at full browser resolution

## **File Format**

- All screenshots are saved in PNG format
- Screenshots maintain the original browser viewport dimensions
- File names include the task ID and step number for easy identification

## **Availability**

- Screenshots are available immediately after capture
- Files are stored for 30 days after task completion
- Screenshots can be disabled in task settings to reduce storage usage

Screenshots are automatically generated for most tasks unless specifically disabled. The number of screenshots depends on the task complexity and duration.

### **Tasks API - Get Task Output File**

Returns a presigned URL for downloading a file from the task output files

**GET** `/api/v1/task/{task_id}/output-file/{file_name}`

**Try it**

Returns a presigned URL for downloading a file from the task output files. This endpoint is useful for retrieving files that were generated or modified during task execution.

## **Path Parameters**

**task_id**

**stringrequired**

ID of the task

**file_name**

**stringrequired**

Name of the output file

## **Response**

**download_url**

**string**

A presigned URL for downloading the file.

### **Scheduled Tasks API - List Scheduled Tasks**

Returns a paginated list of all scheduled tasks belonging to the user

**GET** `/api/v1/scheduled-tasks`

**Try it**

Returns a paginated list of all scheduled tasks belonging to the user, ordered by creation date. Each task includes basic information like schedule type, next run time, and status.

## **Query Parameters**

**page**

**integerdefault:"1"**

Page number (minimum: 1)

**limit**

**integerdefault:"10"**

Number of items per page (minimum: 1)

## **Response**

**tasks**

**array**

List of scheduled tasks

**id**

**string**

The unique identifier for the scheduled task

**task**

**string**

Instructions for what the agent should do

**save_browser_data**

**boolean**

Whether to save browser cookies and data

**structured_output_json**

**string**

JSON schema for structured output

**llm_model**

**string**

LLM model to use

**use_adblock**

**boolean**

Whether to use an adblocker

**use_proxy**

**boolean**

Whether to use a proxy

**highlight_elements**

**boolean**

Whether to highlight elements on the page

**schedule_type**

**string**

Type of schedule: “interval” or “cron”

**interval_minutes**

**integer**

Minutes between runs

**cron_expression**

**string**

Cron expression for scheduling

**start_at**

**string**

When to start the schedule

**next_run_at**

**string**

When the next run is scheduled

**end_at**

**string**

When to end the schedule

**is_active**

**boolean**

Whether the scheduled task is active

**created_at**

**string**

When the scheduled task was created

**updated_at**

**string**

When the scheduled task was last updated

**total_pages**

**integer**

Total number of pages

**page**

**integer**

Current page number

**limit**

**integer**

Number of items per page

**total_count**

**integer**

Total number of scheduled tasks

### **Scheduled Tasks API - Create Scheduled Task**

Create a new scheduled task to run at regular intervals or based on a cron expression

**POST** `/api/v1/scheduled-task`

**Try it**

Creates a new scheduled task to run at regular intervals or based on a cron expression. This allows you to automate recurring browser automation tasks.

This endpoint requires an active subscription.

## **Request Body**

**task**

**stringrequired**

Instructions for what the agent should do

**schedule_type**

**stringrequired**

Type of schedule: “interval” or “cron”

**interval_minutes**

**integer**

Minutes between runs (required for interval schedule)

**cron_expression**

**string**

Cron expression for scheduling (required for cron schedule)

**start_at**

**string**

When to start the schedule (ISO 8601 format, defaults to now)

**end_at**

**string**

When to end the schedule (ISO 8601 format, defaults to 1 year from now)

**secrets**

**object**

Dictionary of secrets to be used by the agent (safely encrypted before storing)

**allowed_domains**

**array**

List of domains the agent is allowed to visit

**save_browser_data**

**booleandefault:"false"**

Whether to save browser cookies and data between runs

**structured_output_json**

**string**

JSON schema for structured output

**llm_model**

**stringdefault:"gpt-4o"**

LLM model to use. Available options: gpt-4o, gpt-4o-mini, gpt-4.1, gpt-4.1-mini, o4-mini, o3, gemini-2.0-flash, gemini-2.0-flash-lite, gemini-2.5-flash-preview-04-17, gemini-2.5-flash, gemini-2.5-pro, claude-3-7-sonnet-20250219, claude-sonnet-4-20250514, llama-4-maverick-17b-128e-instruct

**use_adblock**

**booleandefault:"true"**

Whether to use an adblocker

**use_proxy**

**booleandefault:"true"**

Whether to use a proxy

**proxy_country_code**

**stringdefault:"us"**

Country code for residential proxy. Must be one of: us, uk, fr, it, jp, au, de, fi, ca, in

**highlight_elements**

**booleandefault:"true"**

Whether to highlight elements on the page

**included_file_names**

**array**

File names to include in the task

**browser_viewport_width**

**integerdefault:"1280"**

Width of browser viewport in pixels

**browser_viewport_height**

**integerdefault:"960"**

Height of browser viewport in pixels

**max_agent_steps**

**integerdefault:"75"**

Maximum number of agent steps (max: 200)

**enable_public_share**

**booleandefault:"false"**

Whether to enable public sharing of task executions

**metadata**

**object**

Optional dictionary of string key-value pairs for custom tagging. Max 10 pairs. Keys: strings (max 100 chars, non-empty). Values: strings (max 1000 chars).

- Either

```
interval_minutes
```

or

```
cron_expression
```

is required depending on the

```
schedule_type
```

.

## **Response**

**id**

**string**

The unique identifier for the created scheduled task.

### **Scheduled Tasks API - Get Scheduled Task**

Returns detailed information about a specific scheduled task

**GET** `/api/v1/scheduled-task/{task_id}`

**Try it**

Returns detailed information about a specific scheduled task, including its schedule configuration and current status.

## **Path Parameters**

**task_id**

**stringrequired**

ID of the scheduled task to retrieve

## **Response**

**id**

**string**

The unique identifier for the scheduled task

**task**

**string**

Instructions for what the agent should do

**save_browser_data**

**boolean**

Whether to save browser cookies and data

**structured_output_json**

**string**

JSON schema for structured output

**llm_model**

**string**

LLM model to use

**use_adblock**

**boolean**

Whether to use an adblocker

**use_proxy**

**boolean**

Whether to use a proxy

**highlight_elements**

**boolean**

Whether to highlight elements on the page

**schedule_type**

**string**

Type of schedule: “interval” or “cron”

**interval_minutes**

**integer**

Minutes between runs

**cron_expression**

**string**

Cron expression for scheduling

**start_at**

**string**

When to start the schedule

**next_run_at**

**string**

When the next run is scheduled

**end_at**

**string**

When to end the schedule

**is_active**

**boolean**

Whether the scheduled task is active

**created_at**

**string**

When the scheduled task was created

**updated_at**

**string**

When the scheduled task was last updated

**metadata**

**object | null**

Custom metadata key-value pairs associated with the scheduled task

### **Scheduled Tasks API - Update Scheduled Task**

Updates a scheduled task with partial updates

**PUT** `/api/v1/scheduled-task/{task_id}`

**Try it**

Updates a scheduled task with partial updates. You can update any combination of the task configuration fields without affecting the others.

## **Path Parameters**

**task_id**

**stringrequired**

ID of the scheduled task to update

## **Request Body**

**task**

**string**

Instructions for what the agent should do

**schedule_type**

**string**

Type of schedule: “interval” or “cron”

**interval_minutes**

**integer**

Minutes between runs (required if schedule_type is “interval”)

**cron_expression**

**string**

Cron expression for scheduling (required if schedule_type is “cron”)

**start_at**

**string**

When to start the schedule (ISO 8601 format)

**end_at**

**string**

When to end the schedule (ISO 8601 format)

**is_active**

**boolean**

Whether the scheduled task is active

**use_adblock**

**boolean**

Whether to use an adblocker

**use_proxy**

**boolean**

Whether to use a proxy

**highlight_elements**

**boolean**

Whether to highlight elements on the page

**llm_model**

**string**

LLM model to use. Available options: gpt-4o, gpt-4o-mini, gpt-4.1, gpt-4.1-mini, o4-mini, o3, gemini-2.0-flash, gemini-2.0-flash-lite, gemini-2.5-flash-preview-04-17, gemini-2.5-flash, gemini-2.5-pro, claude-3-7-sonnet-20250219, claude-sonnet-4-20250514, llama-4-maverick-17b-128e-instruct

**save_browser_data**

**boolean**

Whether to save browser cookies and data between runs

**structured_output_json**

**string**

JSON schema for structured output

**metadata**

**object**

Optional dictionary of string key-value pairs for custom tagging. Max 10 pairs. Keys: strings (max 100 chars, non-empty). Values: strings (max 1000 chars).

## **Response**

Returns the updated scheduled task object with the same format as the Get Scheduled Task response.

**id**

**string**

The unique identifier for the scheduled task

**task**

**string**

Instructions for what the agent should do

**save_browser_data**

**boolean**

Whether to save browser cookies and data

**structured_output_json**

**string**

JSON schema for structured output

**llm_model**

**string**

LLM model to use

**use_adblock**

**boolean**

Whether to use an adblocker

**use_proxy**

**boolean**

Whether to use a proxy

**highlight_elements**

**boolean**

Whether to highlight elements on the page

**schedule_type**

**string**

Type of schedule: “interval” or “cron”

**interval_minutes**

**integer**

Minutes between runs

**cron_expression**

**string**

Cron expression for scheduling

**start_at**

**string**

When to start the schedule

**next_run_at**

**string**

When the next run is scheduled

**end_at**

**string**

When to end the schedule

**is_active**

**boolean**

Whether the scheduled task is active

**created_at**

**string**

When the scheduled task was created

**updated_at**

**string**

When the scheduled task was last updated

**metadata**

**object | null**

Custom metadata key-value pairs associated with the scheduled task

### **Scheduled Tasks API - Delete Scheduled Task**

Deletes a scheduled task

**DELETE** `/api/v1/scheduled-task/{task_id}`

**Try it**

Deletes a scheduled task. This will prevent any future runs of this task. Any currently running instances of this task will be allowed to complete.

## **Path Parameters**

**task_id**

**stringrequired**

ID of the scheduled task to delete

## **Response**

The endpoint returns an empty response body with a 200 status code on success.

## **Usage Notes**

- Deletion is permanent and cannot be undone
- Any currently running instances of this task will be allowed to complete
- Future scheduled runs will be prevented
- The task will be removed from the scheduled tasks list immediately

Deleting a scheduled task is irreversible. Make sure you want to permanently remove the task before proceeding.

### **Browser Profiles API - List Browser Profiles**

Returns a paginated list of all browser profiles belonging to the user.

**GET** `/api/v1/browser-profiles`

**Try it**

Returns a paginated list of all browser profiles belonging to the user, ordered by creation date. Each profile includes configuration like ad blocker settings, proxy settings, and viewport dimensions.

Pay-as-you-go users can only have one profile. Subscription users can create multiple profiles.

### **Query Parameters**

**page**

**integerdefault:"1"**

Page number (minimum: 1)

**limit**

**integerdefault:"10"**

Number of items per page (minimum: 1)

### **Response**

**profiles**

**array**

List of browser profiles

**profile_id**

**string**

Unique identifier for the browser profile

**profile_name**

**string**

Name of the browser profile

**description**

**string**

Description of the profile

**persist**

**boolean**

Save cookies, local storage, and session data between tasks

**ad_blocker**

**boolean**

Block ads and popups during automated tasks

**proxy**

**boolean**

Route traffic through mobile proxies for better stealth

**proxy_country_code**

**string**

Country code for the proxy

**browser_viewport_width**

**integer**

Browser viewport width in pixels

**browser_viewport_height**

**integer**

Browser viewport height in pixels

**total_pages**

**integer**

Total number of pages

**page**

**integer**

Current page number

**limit**

**integer**

Number of items per page

**total_count**

**integer**

Total number of browser profiles

### **Browser Profiles API - Create Browser Profile**

Create a new browser profile with custom settings for ad blocking, proxy usage, and viewport dimensions.

**POST** `/api/v1/browser-profiles`

**Try it**

Create a new browser profile with custom settings for ad blocking, proxy usage, and viewport dimensions.

Pay-as-you-go users can only have one profile. Subscription users can create multiple profiles.

### **Request Body**

**profile_name**

**stringrequired**

Name of the browser profile

**description**

**stringdefault:""**

Description of the profile

**persist**

**booleandefault:"true"**

Save cookies, local storage, and session data between tasks

**ad_blocker**

**booleandefault:"true"**

Block ads and popups during automated tasks

**proxy**

**booleandefault:"true"**

Route traffic through mobile proxies for better stealth

**proxy_country_code**

**stringdefault:"US"**

Country code for the proxy

**browser_viewport_width**

**integerdefault:"1280"**

Browser viewport width in pixels

**browser_viewport_height**

**integerdefault:"960"**

Browser viewport height in pixels

### **Response**

**profile_id**

**string**

Unique identifier for the created browser profile

**profile_name**

**string**

Name of the browser profile

**description**

**string**

Description of the profile

**persist**

**boolean**

Save cookies, local storage, and session data between tasks

**ad_blocker**

**boolean**

Block ads and popups during automated tasks

**proxy**

**boolean**

Route traffic through mobile proxies for better stealth

**proxy_country_code**

**string**

Country code for the proxy

**browser_viewport_width**

**integer**

Browser viewport width in pixels

**browser_viewport_height**

**integer**

Browser viewport height in pixels

### **Browser Profiles API - Get Browser Profile**

Returns information about a specific browser profile and its configuration settings.

**GET** `/api/v1/browser-profiles/{profile_id}`

**Try it**

Returns information about a specific browser profile and its configuration settings.

### **Path Parameters**

**profile_id**

**stringrequired**

ID of the browser profile to retrieve

### **Response**

**profile_id**

**string**

Unique identifier for the browser profile

**profile_name**

**string**

Name of the browser profile

**description**

**string**

Description of the profile

**persist**

**boolean**

Save cookies, local storage, and session data between tasks

**ad_blocker**

**boolean**

Block ads and popups during automated tasks

**proxy**

**boolean**

Route traffic through mobile proxies for better stealth

**proxy_country_code**

**string**

Country code for the proxy

**browser_viewport_width**

**integer**

Browser viewport width in pixels

**browser_viewport_height**

**integer**

Browser viewport height in pixels

### **Browser Profiles API - Update Browser Profile**

Update a browser profile with partial updates. Only the fields you want to change need to be included.

**PUT** `/api/v1/browser-profiles/{profile_id}`

**Try it**

Update a browser profile with partial updates. Only the fields you want to change need to be included.

### **Path Parameters**

**profile_id**

**stringrequired**

ID of the browser profile to update

### **Request Body**

**profile_name**

**string**

Name of the browser profile

**description**

**string**

Description of the profile

**persist**

**boolean**

Save cookies, local storage, and session data between tasks

**ad_blocker**

**boolean**

Block ads and popups during automated tasks

**proxy**

**boolean**

Route traffic through mobile proxies for better stealth

**proxy_country_code**

**string**

Country code for the proxy

**browser_viewport_width**

**integer**

Browser viewport width in pixels

**browser_viewport_height**

**integer**

Browser viewport height in pixels

### **Response**

**profile_id**

**string**

Unique identifier for the updated browser profile

**profile_name**

**string**

Name of the browser profile

**description**

**string**

Description of the profile

**persist**

**boolean**

Save cookies, local storage, and session data between tasks

**ad_blocker**

**boolean**

Block ads and popups during automated tasks

**proxy**

**boolean**

Route traffic through mobile proxies for better stealth

**proxy_country_code**

**string**

Country code for the proxy

**browser_viewport_width**

**integer**

Browser viewport width in pixels

**browser_viewport_height**

**integer**

Browser viewport height in pixels

### **Browser Profiles API - Delete Browser Profile**

Deletes a browser profile. This will remove the profile and all associated browser data.

**DELETE** `/api/v1/browser-profiles/{profile_id}`

**Try it**

Deletes a browser profile. This will remove the profile and all associated browser data. This action cannot be undone!

### **Path Parameters**

**profile_id**

**stringrequired**

ID of the browser profile to delete

### **Response**

A successful deletion returns an empty object.

### **Files API - Upload File Presigned URL**

Returns a presigned URL for uploading a file to the user’s files bucket

**POST** `/api/v1/uploads/presigned-url`

**Try it**

Returns a presigned URL for uploading a file to the user’s files bucket. After uploading a file, you can include it in tasks using the

```
included_file_names
```

field in the

```
RunTaskRequest
```

.

## **Request Body**

**file_name**

**stringrequired**

Name of the file to upload (e.g., ‘data.csv’, ‘image.png’)

**content_type**

**stringrequired**

Content type of the file (e.g., ‘text/csv’, ‘image/png’, ‘application/pdf’). Only images and documents are supported.

## **Response**

**upload_url**

**string**

A presigned URL to upload the file to.

## **File Usage in Tasks**

To use uploaded files in your tasks, include their names in the

```
included_file_names
```

array when creating a task:

Copy

Ask AI

`{  "task": "Process the data in the CSV file and extract the top 5 rows",  "included_file_names": ["data.csv", "config.json"]}`

The agent will have access to these files during task execution and can read their contents.

## **Supported File Types**

The following file types are supported for upload:

- Text files: **`.txt`**, **`.csv`**, **`.json`**, **`.xml`**, **`.html`**, **`.md`**
- Images: **`.jpg`**, **`.jpeg`**, **`.png`**, **`.gif`**, **`.webp`**
- Documents: **`.pdf`**, **`.doc`**, **`.docx`**, **`.xls`**, **`.xlsx`**, **`.ppt`**, **`.pptx`**

## **File Size Limits**

- Maximum file size: 10 MB per file
- Maximum total size of all files for a task: 50 MB

Files are automatically deleted after 30 days unless they are used in a scheduled task.

### **User API - Check Balance**

Returns the user’s current API credit balance

**GET** `/api/v1/balance`

**Try it**

Returns the user’s current API credit balance, which includes both monthly subscription credits and any additional purchased credits.

## **Response**

**balance**

**string**

The current number of API credits available, with the value in cents (0.01 USD = 1 credit).

## **API Credit Usage**

Each task execution consumes API credits based on the following factors:

1. **Task Duration**: Longer running tasks consume more credits
2. **LLM Model**: More powerful models consume more credits
3. **Browser Features**: Features like proxy usage and adblock may affect credit consumption
4. **Task Complexity**: More complex tasks with many steps consume more credits

You can monitor your credit usage through the

[**Browser Use Cloud dashboard**](https://cloud.browser-use.com/dashboard)

or by using the Check Balance endpoint.

If your balance reaches zero, new task executions will be rejected until you add more credits or your subscription renews.

### **User API - Me**

Returns a boolean value indicating if the API key is valid and the user is authenticated

**GET** `/api/v1/me`

**Try it**

Returns a boolean value indicating if the API key is valid and the user is authenticated.

## **Response**

The endpoint returns a boolean value directly (not wrapped in an object):

- **`true`** if the API key is valid and the user is authenticated
- **`false`** if the API key is invalid or the user is not authenticated

## **Usage Notes**

- This endpoint is useful for validating API keys before making other API calls
- Unlike other endpoints, this returns a simple boolean value rather than an object
- A **`true`** response confirms both authentication and authorization
- This endpoint can be used for health checks of your API integration

Use this endpoint to verify your API key is working correctly before making other API calls, especially in automated systems.

### **Health Check API - Ping**

Check if the server is running and responding

**GET** `/api/v1/ping`

**Try it**

Use this endpoint to check if the server is running and responding. This is the only endpoint that doesn’t require authentication.**Response**A successful response has a 200 status code with an empty JSON object.