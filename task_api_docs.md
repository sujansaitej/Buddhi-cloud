Tasks API
Run Task
Requires an active subscription. Returns the task ID that can be used to track progress.

POST
/
api
/
v1
/
run-task

Try it
Creates a new browser automation task and returns the task ID that can be used to track progress.
​
Request Body
​
task
stringrequired
Instructions for what the agent should do. You can try it out at https://cloud.browser-use.com/
​
secrets
object
Dictionary of secrets to be used by the agent. Secrets are safely encrypted before storing in the database.
​
allowed_domains
array
List of domains that the agent is allowed to visit (e.g. [“google.com”, “amazon.com”, “.skyscanner.com”]).
We recommend using a wildcard to allow all subdomains of a domain (e.g. “.skyscanner.com”).
If not set, the agent will be allowed to visit all domains (not recommended if you are using secrets).
​
browser_profile_id
string
ID of the browser profile to use. If not set, the default profile will be used.
​
save_browser_data
booleandefault:"false"
If set to True, the browser cookies and other data will be saved. Cookies are safely encrypted before storing in the database.
​
structured_output_json
string
If set, the agent will use this JSON schema as the output model (see example here: https://docs.browser-use.com/cloud/implementation#structured-output-example).
​
llm_model
stringdefault:"gpt-4.1"
LLM model to use. Available options:
gpt-4o
gpt-4o-mini
gpt-4.1
gpt-4.1-mini
gemini-2.5-flash
claude-sonnet-4-20250514
​
use_adblock
booleandefault:"true"
If set to True, the agent will use an adblocker.
​
use_proxy
booleandefault:"true"
If set to True, the agent will use a (mobile) proxy. Note that proxy is required for captcha solving, so if you disable proxy, you will not be able to solve captchas.
​
proxy_country_code
stringdefault:"us"
Country code for residential proxy. Must be one of: ‘us’, ‘fr’, ‘it’, ‘jp’, ‘au’, ‘de’, ‘fi’, ‘ca’. Default is ‘us’.
​
highlight_elements
booleandefault:"true"
If set to True, the agent will highlight the elements on the page.
​
included_file_names
array
File names to include in the task (note: use uploads/presigned-url endpoint to upload the files first!). E.g. [‘file1.txt’, ‘file2.csv’]
​
browser_viewport_width
integerdefault:"1280"
Width of the browser viewport in pixels. Default is 1280.
​
browser_viewport_height
integerdefault:"960"
Height of the browser viewport in pixels. Default is 960.
​
max_agent_steps
integerdefault:"75"
Maximum number of agent steps to take. Default is 75. Maximum is 200.
​
enable_public_share
booleandefault:"false"
If set to True, enables public sharing of the task execution. When enabled, a public_share_url will be generated that allows others to view the task results without authentication.
​
metadata
object
Optional dictionary of string key-value pairs for custom tagging. Max 10 pairs. Keys: strings (max 100 chars, non-empty). Values: strings (max 1000 chars).
​
Response
​
id
string
The unique identifier for the created task.

Tasks API
Stop Task
Stops a running browser automation task immediately.

PUT
/
api
/
v1
/
stop-task

Try it
Stops a running browser automation task immediately. The task cannot be resumed after being stopped. Use /pause-task endpoint instead if you want to temporarily halt execution.
​
Parameters
​
task_id
stringrequired
ID of the task to stop
​
Response
The endpoint returns an empty response body with a 200 status code on success.

Tasks API
Pause Task
Pauses execution of a running task

PUT
/
api
/
v1
/
pause-task

Try it
Pauses execution of a running task. The task can be resumed later using the /resume-task endpoint. Useful for manual intervention or inspection.
​
Parameters
​
task_id
stringrequired
ID of the task to pause
​
Response
The endpoint returns an empty response body with a 200 status code on success.

Tasks API
Resume Task
Resumes execution of a previously paused task

PUT
/
api
/
v1
/
resume-task

Try it
Resumes execution of a previously paused task. The task will continue from where it was paused. You can’t resume a stopped task.
​
Parameters
​
task_id
stringrequired
ID of the task to resume
​
Response
The endpoint returns an empty response body with a 200 status code on success.
Tasks API
Get Task
Get comprehensive information about a task

GET
/
api
/
v1
/
task
/
{task_id}

Try it
Returns comprehensive information about a task, including its current status, steps completed, output, and other metadata.
​
Path Parameters
​
task_id
stringrequired
ID of the task to retrieve
​
Response
​
id
stringrequired
The unique identifier for the task
​
task
stringrequired
The original task instructions
​
output
string | nullrequired
The final output or result from the task (if completed)
​
status
enum<string>required
Enumeration of possible task states.
created: Task is initialized but not yet started
running: Task is currently executing
finished: Task has completed successfully
stopped: Task was manually stopped
paused: Task execution is temporarily paused
failed: Task encountered an error and could not complete
Available options: created, running, finished, stopped, paused, failed
​
created_at
stringrequired
ISO 8601 timestamp of when the task was created
​
steps
TaskStepResponse · object[]required
List of task steps with execution details
Show Hide child attributes

​
live_url
string | null
URL to view live task execution. To preview the url you can directly integrate it in <iframe> tag. For example: <iframe src={live_url} width="600" height="450"></iframe> Which will display the task execution and allows you to control the agent live. It is pure VNC implementation.
​
finished_at
string | null
ISO 8601 timestamp of when the task finished (if completed)
​
browser_data
object | null
Browser session data (if save_browser_data was enabled)
This field is only available if save_browser_data is set to True in the request.
Show Hide child attributes

​
user_uploaded_files
string[] | null
List of files uploaded by the user for this task
​
output_files
string[] | null
List of files generated during task execution
​
public_share_url
string | null
Public URL for sharing the task (if public sharing was enabled)
​
metadata
object | null
Custom metadata key-value pairs associated with the task

Tasks API
Get Task Status
Get the current status of a task

GET
/
api
/
v1
/
task
/
{task_id}
/
status

Try it
Returns just the current status of a task (created, running, finished, stopped, paused, or failed). This is more lightweight than the full task details endpoint.
​
Path Parameters
​
task_id
stringrequired
ID of the task to check status for
​
Response
The endpoint returns the status as a simple string value (not wrapped in an object).
​
Status Values
The status field can have one of the following values:
created: Task is initialized but not yet started
running: Task is currently executing
finished: Task has completed successfully
stopped: Task was manually stopped
paused: Task execution is temporarily paused
failed: Task encountered an error and could not complete
​
Tasks API
List Tasks
Get a paginated list of all tasks

GET
/
api
/
v1
/
tasks

Try it
Returns a paginated list of all tasks belonging to the user, ordered by creation date. Each task includes basic information like status and creation time. For detailed task info, use the get task endpoint.
​
page
integerdefault:"1"
Page number (minimum: 1)
​
limit
integerdefault:"10"
Number of items per page (minimum: 1)
​
tasks
array
List of simplified task objects
​
id
string
Unique identifier for the task
​
task
string
Original task instructions
​
output
string
Final output or result from the task
​
status
string
Current status of the task
​
created_at
string
ISO 8601 timestamp of task creation
​
finished_at
string
ISO 8601 timestamp of task completion
​
live_url
string
URL to view live task execution
​
total_pages
integer
Total number of pages available
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
Total number of tasks across all pages
​
Pagination
The API uses offset-based pagination:
page: Start from page 1
limit: Maximum 100 items per page
total_pages: Use this to implement pagination UI
total_count: Total number of tasks across all pages
​
Ordering
Tasks are ordered by creation date (newest first). This ensures that recently created tasks appear at the top of the list.


