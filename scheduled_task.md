
Scheduled Tasks API
Create Scheduled Task
Create a new scheduled task to run at regular intervals or based on a cron expression

POST
/
api
/
v1
/
scheduled-task

Try it
Creates a new scheduled task to run at regular intervals or based on a cron expression. This allows you to automate recurring browser automation tasks.
This endpoint requires an active subscription.
​
Request Body
​
task
stringrequired
Instructions for what the agent should do
​
schedule_type
stringrequired
Type of schedule: “interval” or “cron”
​
interval_minutes
integer
Minutes between runs (required for interval schedule)
​
cron_expression
string
Cron expression for scheduling (required for cron schedule)
​
start_at
string
When to start the schedule (ISO 8601 format, defaults to now)
​
end_at
string
When to end the schedule (ISO 8601 format, defaults to 1 year from now)
​
secrets
object
Dictionary of secrets to be used by the agent (safely encrypted before storing)
​
allowed_domains
array
List of domains the agent is allowed to visit
​
save_browser_data
booleandefault:"false"
Whether to save browser cookies and data between runs
​
structured_output_json
string
JSON schema for structured output
​
llm_model
stringdefault:"gpt-4o"
LLM model to use. Available options: gpt-4o, gpt-4o-mini, gpt-4.1, gpt-4.1-mini, o4-mini, o3, gemini-2.0-flash, gemini-2.0-flash-lite, gemini-2.5-flash-preview-04-17, gemini-2.5-flash, gemini-2.5-pro, claude-3-7-sonnet-20250219, claude-sonnet-4-20250514, llama-4-maverick-17b-128e-instruct
​
use_adblock
booleandefault:"true"
Whether to use an adblocker
​
use_proxy
booleandefault:"true"
Whether to use a proxy
​
proxy_country_code
stringdefault:"us"
Country code for residential proxy. Must be one of: us, uk, fr, it, jp, au, de, fi, ca, in
​
highlight_elements
booleandefault:"true"
Whether to highlight elements on the page
​
included_file_names
array
File names to include in the task
​
browser_viewport_width
integerdefault:"1280"
Width of browser viewport in pixels
​
browser_viewport_height
integerdefault:"960"
Height of browser viewport in pixels
​
max_agent_steps
integerdefault:"75"
Maximum number of agent steps (max: 200)
​
enable_public_share
booleandefault:"false"
Whether to enable public sharing of task executions
​
metadata
object
Optional dictionary of string key-value pairs for custom tagging. Max 10 pairs. Keys: strings (max 100 chars, non-empty). Values: strings (max 1000 chars).
*Either interval_minutes or cron_expression is required depending on the schedule_type.
​
Response
​
id
string
The unique identifier for the created scheduled task.

Scheduled Tasks API
List Scheduled Tasks
Returns a paginated list of all scheduled tasks belonging to the user

GET
/
api
/
v1
/
scheduled-tasks

Try it
Returns a paginated list of all scheduled tasks belonging to the user, ordered by creation date. Each task includes basic information like schedule type, next run time, and status.
​
Query Parameters
​
page
integerdefault:"1"
Page number (minimum: 1)
​
limit
integerdefault:"10"
Number of items per page (minimum: 1)
​
Response
​
tasks
array
List of scheduled tasks
​
id
string
The unique identifier for the scheduled task
​
task
string
Instructions for what the agent should do
​
save_browser_data
boolean
Whether to save browser cookies and data
​
structured_output_json
string
JSON schema for structured output
​
llm_model
string
LLM model to use
​
use_adblock
boolean
Whether to use an adblocker
​
use_proxy
boolean
Whether to use a proxy
​
highlight_elements
boolean
Whether to highlight elements on the page
​
schedule_type
string
Type of schedule: “interval” or “cron”
​
interval_minutes
integer
Minutes between runs
​
cron_expression
string
Cron expression for scheduling
​
start_at
string
When to start the schedule
​
next_run_at
string
When the next run is scheduled
​
end_at
string
When to end the schedule
​
is_active
boolean
Whether the scheduled task is active
​
created_at
string
When the scheduled task was created
​
updated_at
string
When the scheduled task was last updated
​
total_pages
integer
Total number of pages
​
page
integer
Current page number
​
limit
integer
Number of items per page
​
total_count
integer
Total number of scheduled tasks

Scheduled Tasks API
Get Scheduled Task
Returns detailed information about a specific scheduled task

GET
/
api
/
v1
/
scheduled-task
/
{task_id}

Try it
Returns detailed information about a specific scheduled task, including its schedule configuration and current status.
​
Path Parameters
​
task_id
stringrequired
ID of the scheduled task to retrieve
​
Response
​
id
string
The unique identifier for the scheduled task
​
task
string
Instructions for what the agent should do
​
save_browser_data
boolean
Whether to save browser cookies and data
​
structured_output_json
string
JSON schema for structured output
​
llm_model
string
LLM model to use
​
use_adblock
boolean
Whether to use an adblocker
​
use_proxy
boolean
Whether to use a proxy
​
highlight_elements
boolean
Whether to highlight elements on the page
​
schedule_type
string
Type of schedule: “interval” or “cron”
​
interval_minutes
integer
Minutes between runs
​
cron_expression
string
Cron expression for scheduling
​
start_at
string
When to start the schedule
​
next_run_at
string
When the next run is scheduled
​
end_at
string
When to end the schedule
​
is_active
boolean
Whether the scheduled task is active
​
created_at
string
When the scheduled task was created
​
updated_at
string
When the scheduled task was last updated
​
metadata
object | null
Custom metadata key-value pairs associated with the scheduled task

Scheduled Tasks API
Update Scheduled Task
Updates a scheduled task with partial updates

PUT
/
api
/
v1
/
scheduled-task
/
{task_id}

Try it
Updates a scheduled task with partial updates. You can update any combination of the task configuration fields without affecting the others.
​
Path Parameters
​
task_id
stringrequired
ID of the scheduled task to update
​
Request Body
​
task
string
Instructions for what the agent should do
​
schedule_type
string
Type of schedule: “interval” or “cron”
​
interval_minutes
integer
Minutes between runs (required if schedule_type is “interval”)
​
cron_expression
string
Cron expression for scheduling (required if schedule_type is “cron”)
​
start_at
string
When to start the schedule (ISO 8601 format)
​
end_at
string
When to end the schedule (ISO 8601 format)
​
is_active
boolean
Whether the scheduled task is active
​
use_adblock
boolean
Whether to use an adblocker
​
use_proxy
boolean
Whether to use a proxy
​
highlight_elements
boolean
Whether to highlight elements on the page
​
llm_model
string
LLM model to use. Available options: gpt-4o, gpt-4o-mini, gpt-4.1, gpt-4.1-mini, o4-mini, o3, gemini-2.0-flash, gemini-2.0-flash-lite, gemini-2.5-flash-preview-04-17, gemini-2.5-flash, gemini-2.5-pro, claude-3-7-sonnet-20250219, claude-sonnet-4-20250514, llama-4-maverick-17b-128e-instruct
​
save_browser_data
boolean
Whether to save browser cookies and data between runs
​
structured_output_json
string
JSON schema for structured output
​
metadata
object
Optional dictionary of string key-value pairs for custom tagging. Max 10 pairs. Keys: strings (max 100 chars, non-empty). Values: strings (max 1000 chars).
​
Response
Returns the updated scheduled task object with the same format as the Get Scheduled Task response.
​
id
string
The unique identifier for the scheduled task
​
task
string
Instructions for what the agent should do
​
save_browser_data
boolean
Whether to save browser cookies and data
​
structured_output_json
string
JSON schema for structured output
​
llm_model
string
LLM model to use
​
use_adblock
boolean
Whether to use an adblocker
​
use_proxy
boolean
Whether to use a proxy
​
highlight_elements
boolean
Whether to highlight elements on the page
​
schedule_type
string
Type of schedule: “interval” or “cron”
​
interval_minutes
integer
Minutes between runs
​
cron_expression
string
Cron expression for scheduling
​
start_at
string
When to start the schedule
​
next_run_at
string
When the next run is scheduled
​
end_at
string
When to end the schedule
​
is_active
boolean
Whether the scheduled task is active
​
created_at
string
When the scheduled task was created
​
updated_at
string
When the scheduled task was last updated
​
metadata
object | null
Custom metadata key-value pairs associated with the scheduled task

Scheduled Tasks API
Delete Scheduled Task
Deletes a scheduled task

DELETE
/
api
/
v1
/
scheduled-task
/
{task_id}

Try it
Deletes a scheduled task. This will prevent any future runs of this task. Any currently running instances of this task will be allowed to complete.
​
Path Parameters
​
task_id
stringrequired
ID of the scheduled task to delete
​
Response
The endpoint returns an empty response body with a 200 status code on success.