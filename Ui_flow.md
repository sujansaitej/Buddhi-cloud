# Nizhal - AI Automation Platform
## Tagline: "Shadow Your Work with AI - Making Automation Simple"

---

## **1. LOGIN & ONBOARDING**

### **1.1 Login Screen**
- **Clean login form** with email/password
- **API Key option** for direct Browser Use users
- **"Get Started"** button for new users
- **Simple branding** with Nizhal logo

### **1.2 Quick Setup (New Users)**
- **Welcome message** and platform intro
- **API Key input** (Browser Use key)
- **Test connection** button (using `/api/v1/me` endpoint)
- **Skip to dashboard** option

---

## **2. MAIN DASHBOARD (Simple & Sweet)**

### **2.1 Header**
- **Nizhal logo** with tagline
- **User avatar** dropdown (profile, logout)
- **"Create Task"** button (prominent) - direct task creation
- **"Create Workflow"** button (secondary) - save reusable workflow

### **2.2 Quick Stats (4 Cards)**
- **Total Tasks** (number from `/api/v1/tasks`)
- **Active Tasks** (running now from task status)
- **Credits Left** (from `/api/v1/balance`)
- **Success Rate** (last 7 days from task history)

### **2.3 Template Gallery**
**Popular Templates (6 cards):**
- **Gmail Automation** - "Auto-reply and organize emails"
- **Data Scraping** - "Extract data from websites"
- **Social Media** - "Post and monitor social accounts"
- **E-commerce** - "Monitor prices and inventory"
- **Form Filling** - "Automate repetitive forms"
- **Report Generation** - "Create automated reports"

**Each template card shows:**
- Icon and name
- Brief description
- "Use Template" button (pre-fills task description)

### **2.4 My Workflows Section**
**Header:**
- **"My Workflows"** title
- **Search box** (simple)
- **Sort dropdown** (Date/Name/Usage)
- **"Create New Workflow"** button

**Workflow List:**
- **Workflow name** and description
- **Last used** date
- **Usage count** (times used)
- **Quick actions** (Use, Edit, Delete, Duplicate)

### **2.5 My Tasks Section**
**Header:**
- **"My Tasks"** title
- **Search box** (simple)
- **Sort dropdown** (Date/Name/Status)
- **"Create New"** button

**Task List:**
- **Task name** and description
- **Last run** date
- **Status** (Running/Finished/Failed/Paused/Stopped)
- **Quick actions** (Run, View, Delete)

---

## **3. SIDEBAR (Collapsible)**

### **3.1 Top Section**
- **User profile card** (avatar, name, email)
- **Account type** badge (Free/Pro)

### **3.2 Navigation (7 items)**
1. **Dashboard** (home icon)
2. **Workflows** (flowchart icon) - reusable workflow templates
3. **Tasks** (play icon) - main task management
4. **Scheduled Tasks** (calendar icon) - for recurring tasks
5. **Templates** (template icon) - built-in templates
6. **History** (clock icon)
7. **Settings** (gear icon)

### **3.3 Bottom Section**
- **Credits display** (real-time from `/api/v1/balance`)
- **Collapse/Expand** toggle

---

## **4. WORKFLOW MANAGEMENT**

### **4.1 Workflows List View**
**Header:**
- **"My Workflows"** title
- **Create New Workflow** button
- **Import Workflow** option (JSON import)
- **Search & Filter** options

**Workflow Cards:**
- **Workflow name** and description
- **Category** tag (Business, Scraping, Social, etc.)
- **Usage count** and last used date
- **Quick actions:**
  - Use Workflow (creates task)
  - Edit Workflow
  - Duplicate Workflow
  - Delete Workflow
  - Export Workflow

**Filter Options:**
- Category filter
- Usage frequency
- Date created
- Search by name/description

### **4.2 Create/Edit Workflow**
**Step 1: Basic Information**
- **Workflow name** (required)
- **Description** (optional)
- **Category** dropdown (Business, Scraping, Social, E-commerce, etc.)
- **Tags** (for easy searching)

**Step 2: Task Instructions**
- **Large text area** with placeholder: "Describe what you want the AI to do..."
- **Examples** button (shows common task examples)
- **AI suggestions** (appears as you type)
- **Variable placeholders** (e.g., {{email}}, {{website}}) for customization

**Step 3: Default Settings**
- **Default model** selection
- **Default browser settings** (viewport, ad blocker, proxy)
- **Default security** (allowed domains)
- **Default files** (commonly used files)

**Step 4: Credentials Template (Optional)**
- **Required credentials** list
- **Service types** (Gmail, Twitter, etc.)
- **Credential descriptions** (what each credential is for)

**Step 5: Save Workflow**
- **Preview** of workflow
- **"Save Workflow"** button
- **"Save & Create Task"** option

### **4.3 Use Workflow (Create Task from Workflow)**
**Workflow Selection:**
- **Choose workflow** from list
- **Preview** workflow details
- **"Use This Workflow"** button

**Customization (Optional):**
- **Override task description** (pre-filled from workflow)
- **Modify settings** (model, browser settings, etc.)
- **Add/remove credentials**
- **Add/remove files**

**Execute:**
- **"Run Task"** button (calls `/api/v1/run-task` with workflow instructions)
- **"Save as New Workflow"** option (if customized)

---

## **5. TASK CREATION (Simple 2-Step Process)**

### **5.1 Step 1: Task Description**
**Natural Language Input:**
- **Large text area** with placeholder: "Describe what you want the AI to do..."
- **Examples** button (shows common task examples)
- **Template selection** (optional - pre-fills description)
- **Workflow selection** (optional - pre-fills from saved workflow)

### **5.2 Step 2: Settings (Collapsible)**
**Basic Settings (always visible):**
- **Model** dropdown (GPT-4o, GPT-4o-mini, GPT-4.1, GPT-4.1-mini, Gemini-2.5-flash, Claude-sonnet-4)
- **Save browser data** toggle
- **Public sharing** toggle

**Advanced Settings (expandable):**
- **Browser settings:**
  - Viewport width/height
  - Ad blocker toggle
  - Proxy usage toggle
  - Proxy country selection
  - Element highlighting toggle
  - Max agent steps (1-200)
- **Security:**
  - Allowed domains (whitelist)
  - Browser profile selection
- **Files:**
  - Upload files (using `/api/v1/uploads/presigned-url`)
  - Include file names in task

### **5.3 Credentials (Optional)**
**Secrets Wallet:**
- **"Add Credentials"** button
- **Service dropdown** (Gmail, Twitter, etc.)
- **Username/Password/API Key** fields
- **"Save Securely"** button (encrypted storage)

### **5.4 Review & Execute**
- **Summary** of task configuration
- **"Run Task"** button (calls `/api/v1/run-task`)
- **"Save as Workflow"** option (for future reuse)

---

## **6. TASK EXECUTION VIEW**

### **6.1 Live View**
**Header:**
- **Task name** and status
- **Progress bar** with step count
- **Action buttons:**
  - Pause (calls `/api/v1/pause-task`)
  - Resume (calls `/api/v1/resume-task`)
  - Stop (calls `/api/v1/stop-task`)

**Main area:**
- **Live browser view** (iframe from `live_url` in task response)
- **Step log** (collapsible sidebar)
- **Real-time status** updates (via webhooks)

### **6.2 Results Panel**
**When completed:**
- **Output display** (formatted from task output)
- **Files generated** (download links from `/api/v1/task/{task_id}/output-file/{file_name}`)
- **Screenshots** (gallery from `/api/v1/task/{task_id}/screenshots`)
- **"Re-run"** button
- **"Save as Workflow"** option (if task was successful)

---

## **7. TASKS MANAGEMENT**

### **7.1 Tasks Dashboard**
**Active Tasks:**
- **Currently running** (with progress from `/api/v1/task/{task_id}/status`)
- **Queue** (pending tasks)
- **Quick actions** (pause, stop, view)

**Recent History:**
- **Last 10 tasks** with status (from `/api/v1/tasks`)
- **Success/failure** indicators
- **Duration** and credits used

### **7.2 Task Details**
**Task info:**
- **Task ID** and creation time
- **Status** and duration
- **Steps taken** and credits used
- **Live URL** (for viewing execution)
- **Workflow used** (if created from workflow)

**Results:**
- **Output** display
- **Screenshots** gallery
- **Files** download
- **"Re-run"** option
- **"Save as Workflow"** option

---

## **8. SCHEDULED TASKS**

### **8.1 Scheduled Tasks List**
**Header:**
- **"Scheduled Tasks"** title
- **Create New** button
- **Filter** by status (Active/Inactive)

**Scheduled Tasks:**
- **Task name** and description
- **Schedule type** (Interval/Cron)
- **Next run** time
- **Status** (Active/Inactive)
- **Workflow used** (if created from workflow)
- **Actions** (Edit, Delete, Toggle)

### **8.2 Create Scheduled Task**
**Same as task creation plus:**
- **Schedule type** (Interval or Cron)
- **Interval minutes** (for interval type)
- **Cron expression** (for cron type)
- **Start date** and **End date**
- **Active** toggle
- **Workflow selection** (optional)

---

## **9. TEMPLATES LIBRARY**

### **9.1 Template Categories**
**4 main categories:**
- **Business** (email, documents, reports)
- **Scraping** (data extraction, monitoring)
- **Social** (posting, engagement)
- **E-commerce** (prices, inventory)

### **9.2 Template Cards**
**Each template shows:**
- **Preview image**
- **Name** and description
- **Difficulty** (Easy/Medium/Hard)
- **Estimated time**
- **"Use Template"** button

---

## **10. HISTORY**

### **10.1 Timeline View**
**Simple list:**
- **Date** grouping
- **Task name** and status
- **Duration** and credits
- **Workflow used** (if applicable)
- **Quick view** button

### **10.2 Filters**
- **Date range** picker
- **Status** filter (All/Success/Failed)
- **Workflow** filter
- **Search** by name

---

## **11. SETTINGS (Organized Tabs)**

### **11.1 API Settings**
**Browser Use Integration:**
- **API Key** input field
- **"Test Connection"** button (calls `/api/v1/me`)
- **"Save"** button
- **Status indicator** (connected/disconnected)

### **11.2 Model Settings**
**Model Configuration:**
- **Default model** dropdown
- **Cost comparison** table
- **Performance** indicators

### **11.3 Browser Profiles**
**Profile Management:**
- **Profile list** (from `/api/v1/browser-profiles`)
- **Create new profile** button
- **Profile settings:**
  - Profile name and description
  - Viewport dimensions
  - Ad blocker toggle
  - Proxy settings
  - Data persistence options

### **11.4 Usage & Billing**
**Credits Overview:**
- **Current balance** (from `/api/v1/balance`)
- **Usage chart** (simple line chart)
- **Purchase credits** button
- **Usage history** table

### **11.5 Wallet (Credentials)**
**Secure Storage:**
- **Add credential** button
- **Credentials list** (service, username, last used)
- **Edit/Delete** actions
- **Encryption** status

### **11.6 Notifications**
**Alert Settings:**
- **Email notifications** toggle
- **Task completion** alerts
- **Credit low** warnings
- **Error notifications**

---

## **12. FILE MANAGEMENT**

### **12.1 Upload Center**
**Simple interface:**
- **Drag & drop** area
- **File list** with size and type
- **Upload progress** bars
- **Delete** options

### **12.2 File Library**
**Organized view:**
- **File name** and type
- **Upload date**
- **Size**
- **Usage** in tasks/workflows

---

## **13. MOBILE VIEW**

### **13.1 Mobile Dashboard**
- **Simplified stats** (2 cards instead of 4)
- **Template grid** (2 columns)
- **Workflow/Task list** (compact)

### **13.2 Mobile Navigation**
- **Bottom tab bar** (Dashboard, Workflows, Tasks, Scheduled Tasks, Settings)
- **Floating action** button (Create Task)

---

## **14. NOTIFICATIONS**

### **14.1 In-App Notifications**
**Notification center:**
- **Task completed** alerts (via webhooks)
- **Error notifications**
- **Credit warnings**
- **System updates**

### **14.2 Email Notifications**
**Optional email alerts:**
- **Task completion** summaries
- **Weekly usage** reports
- **Credit low** warnings

---

## **15. HELP & SUPPORT**

### **15.1 Help Center**
**Simple help section:**
- **FAQ** (common questions)
- **Video tutorials** (short clips)
- **Contact support** button
- **Documentation** link

### **15.2 Onboarding**
**New user guidance:**
- **Tooltips** on first visit
- **Guided tour** option
- **Sample workflows** to try

---

## **KEY DESIGN PRINCIPLES**

### **Simplicity First**
- **Clean, uncluttered** interfaces
- **Progressive disclosure** (show advanced options only when needed)
- **Consistent** design patterns
- **Intuitive** navigation

### **User-Friendly**
- **Natural language** input for tasks
- **Reusable workflows** for common patterns
- **One-click** actions where possible
- **Clear feedback** for all actions
- **Helpful defaults** for settings

### **Efficient Workflow**
- **2-step** task creation
- **Workflow templates** for reuse
- **Quick access** to common actions
- **Smart defaults** for settings
- **Direct task execution**

### **Visual Hierarchy**
- **Important actions** are prominent
- **Secondary features** are accessible but not overwhelming
- **Clear status** indicators
- **Consistent** color coding

---

## **API INTEGRATION SUMMARY**

### **Core APIs Used:**
- **Task Management**: `/api/v1/run-task`, `/api/v1/task/{id}`, `/api/v1/tasks`
- **Task Control**: `/api/v1/pause-task`, `/api/v1/resume-task`, `/api/v1/stop-task`
- **Scheduled Tasks**: `/api/v1/scheduled-task`, `/api/v1/scheduled-tasks`
- **Browser Profiles**: `/api/v1/browser-profiles`
- **File Management**: `/api/v1/uploads/presigned-url`
- **User Info**: `/api/v1/me`, `/api/v1/balance`
- **Webhooks**: Real-time task status updates

### **All Features Are API-Supported:**
✅ **Task creation** with natural language
✅ **Workflow templates** (stored locally, used as task instructions)
✅ **Live browser viewing** via iframe
✅ **Task control** (pause/resume/stop)
✅ **Scheduled tasks** with intervals/cron
✅ **Browser profiles** management
✅ **File uploads** and downloads
✅ **Credential storage** via secrets
✅ **Real-time notifications** via webhooks
✅ **Credit management** and billing
✅ **Task history** and analytics

### **Workflow Management (Local Storage):**
✅ **Create workflows** with task instructions
✅ **Save workflows** for reuse
✅ **Use workflows** to create tasks
✅ **Edit and manage** workflows
✅ **Export/Import** workflows
✅ **Workflow analytics** (usage tracking)

This UI flow now includes comprehensive workflow management while maintaining full API compatibility. Users can create reusable workflow templates that store task instructions and use them to quickly create tasks with the Browser Use API.