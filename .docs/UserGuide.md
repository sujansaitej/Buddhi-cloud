# Buddhi Flow - User Guide

Welcome to Buddhi Flow, your intelligent browser automation companion. This guide will help you get started and make the most of the platform's features.

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Dashboard Overview](#2-dashboard-overview)
3. [Creating Tasks](#3-creating-tasks)
4. [Managing Browser Profiles](#4-managing-browser-profiles)
5. [Scheduling Tasks](#5-scheduling-tasks)
6. [Using Workflows](#6-using-workflows)
7. [Credential Wallet](#7-credential-wallet)
8. [Monitoring & Analytics](#8-monitoring--analytics)
9. [Advanced Features](#9-advanced-features)
10. [Troubleshooting](#10-troubleshooting)

## 1. Getting Started

### 1.1 Account Setup

1. **Sign Up / Login**
   - Navigate to the Buddhi Flow platform
   - Sign up with your email or login with existing credentials
   - You can also use the API Key option for direct Browser Use users

2. **API Key Configuration**
   - After logging in, navigate to Settings
   - Enter your Browser Use API key
   - Click "Test Connection" to verify your key works

3. **First-time Setup**
   - Complete the quick onboarding process
   - Set your default preferences for automation tasks
   - Explore the template gallery to understand capabilities

### 1.2 Interface Overview

The Buddhi Flow interface consists of:

- **Header**: Navigation, user profile, and quick action buttons
- **Sidebar**: Main navigation menu
- **Main Content Area**: Dashboard, tasks, and other content
- **Footer**: Credits display and additional links

## 2. Dashboard Overview

### 2.1 Quick Stats

The dashboard displays key metrics at a glance:

- **Total Tasks**: Number of tasks created
- **Active Tasks**: Currently running tasks
- **Credits Left**: Remaining API credits
- **Success Rate**: Task completion success percentage

### 2.2 Template Gallery

Browse and use pre-built templates for common automation tasks:

- **Gmail Automation**: Auto-reply and organize emails
- **Data Scraping**: Extract data from websites
- **Social Media**: Post and monitor social accounts
- **E-commerce**: Monitor prices and inventory
- **Form Filling**: Automate repetitive forms
- **Report Generation**: Create automated reports

### 2.3 Recent Tasks

View your recently created or executed tasks:

- **Task Name**: Brief description of the task
- **Last Run**: When the task was last executed
- **Status**: Current status (Running, Finished, Failed)
- **Actions**: Quick buttons to run, view, or delete tasks

### 2.4 Workflow Suggestions

AI-powered workflow recommendations based on your usage patterns:

- Each suggestion includes a confidence score
- Estimated time/cost savings
- One-click implementation button

## 3. Creating Tasks

### 3.1 Simple Task Creation

1. Click the "Create Task" button in the header
2. Enter a task name and description
3. Type your instructions in natural language
4. Click "Run Now" to execute immediately

### 3.2 Advanced Task Options

Expand the "Advanced Options" section to configure:

- **Browser Profile**: Select a saved browser profile
- **Allowed Domains**: Restrict which websites can be accessed
- **LLM Model**: Choose the AI model (GPT-4o, Claude, etc.)
- **Browser Settings**: Configure viewport size, adblock, proxy
- **Max Steps**: Limit the number of automation steps
- **Structured Output**: Define a JSON schema for structured results

### 3.3 Task Instructions Best Practices

For optimal results, follow these guidelines when writing task instructions:

- **Be Specific**: Clearly state what you want to accomplish
- **Include Steps**: Break complex tasks into sequential steps
- **Provide Examples**: Include examples of expected outputs
- **Specify Constraints**: Mention any limitations or requirements

Example:
```
Go to amazon.com and search for "wireless headphones".
Filter by:
- 4 stars and up
- Price range $50-$150
- Free shipping
Collect the top 5 results with:
- Product name
- Price
- Rating
- Number of reviews
- Key features (bullet points)
```

### 3.4 Monitoring Task Execution

While a task is running:

- View the live browser view to see automation in action
- Monitor the step-by-step progress in the console
- See the current status and elapsed time
- Use the pause/stop buttons if needed

## 4. Managing Browser Profiles

### 4.1 Creating Browser Profiles

1. Navigate to "Browser Profiles" in the sidebar
2. Click "Create New Profile"
3. Fill in the profile details:
   - **Name**: Descriptive name for the profile
   - **Description**: Optional details about the profile's purpose
   - **Viewport Size**: Browser window dimensions
   - **AdBlock**: Enable/disable ad blocking
   - **Proxy Settings**: Configure proxy usage and country
   - **Data Persistence**: Save cookies and session data between tasks

4. Click "Create Profile" to save

### 4.2 Using Profiles with Tasks

When creating or editing a task:

1. Expand the "Advanced Options" section
2. Select your profile from the "Browser Profile" dropdown
3. The task will use all settings from the selected profile

### 4.3 Editing and Deleting Profiles

- **Edit**: Click the edit icon next to a profile
- **Delete**: Click the delete icon (confirmation required)
- **Duplicate**: Create a copy of an existing profile

## 5. Scheduling Tasks

### 5.1 Creating Scheduled Tasks

1. Navigate to "Scheduled Tasks" in the sidebar
2. Click "Create Scheduled Task"
3. Configure the task details and instructions
4. Set the schedule parameters:
   - **Schedule Type**: Interval or Cron
   - **Interval**: Run every X minutes/hours/days
   - **Cron Expression**: Advanced scheduling with cron syntax
   - **Start Date/Time**: When to begin the schedule
   - **End Date/Time**: When to end the schedule (optional)
5. Click "Create Schedule" to save

### 5.2 Schedule Management

From the Scheduled Tasks page:

- **Enable/Disable**: Toggle the active status
- **Edit**: Modify schedule settings or task instructions
- **Delete**: Remove a scheduled task
- **Run Now**: Execute the task immediately
- **View History**: See past executions of the scheduled task

### 5.3 Schedule Types

#### Interval Scheduling
- Simple recurring schedule based on time intervals
- Example: Run every 2 hours

#### Cron Scheduling
- Advanced scheduling using cron expressions
- Format: `minute hour day-of-month month day-of-week`
- Example: `0 9 * * 1-5` (Run at 9 AM on weekdays)

## 6. Using Workflows

### 6.1 What are Workflows?

Workflows are reusable automation templates that can be:
- Saved for repeated use
- Shared with team members
- Customized for different scenarios
- Used as building blocks for complex automation

### 6.2 Creating Workflows

1. Navigate to "Workflows" in the sidebar
2. Click "Create New Workflow"
3. Define the workflow:
   - **Name**: Descriptive name
   - **Description**: Purpose and usage details
   - **Instructions**: The core automation instructions
   - **Parameters**: Define customizable parts of the workflow
4. Click "Save Workflow"

### 6.3 Using Existing Workflows

1. Navigate to "Workflows" in the sidebar
2. Browse or search for the desired workflow
3. Click "Use Workflow"
4. Fill in any required parameters
5. Click "Run" to execute

## 7. Credential Wallet

### 7.1 Storing Credentials

The Credential Wallet securely stores authentication information:

1. Navigate to "Wallet" in the sidebar
2. Click "Add New Credential"
3. Select the credential type:
   - **Website Login**: Username/password for websites
   - **API Key**: For service integrations
   - **OAuth**: For OAuth-based services
4. Enter the required information
5. Click "Save" to securely store the credential

### 7.2 Using Credentials in Tasks

When creating a task:

1. Expand the "Credentials" section
2. Select the credentials to use
3. The automation will securely use these credentials

### 7.3 Security Features

- All credentials are encrypted before storage
- Credentials are never exposed in task results
- Domain restrictions prevent unauthorized usage
- Audit logs track credential usage

## 8. Monitoring & Analytics

### 8.1 Automation Health Dashboard

Navigate to the "Health" section to view:

- **Success Rates**: Overall and per-workflow success percentages
- **Response Times**: Average and trending task durations
- **Active Automations**: Currently running tasks
- **Resource Usage**: API credits consumption
- **Failure Alerts**: Notifications about failed tasks

### 8.2 Task History

View detailed history of all tasks:

1. Navigate to "History" in the sidebar
2. Browse the list of past tasks
3. Filter by status, date range, or task type
4. Click on any task to view detailed information:
   - Step-by-step execution log
   - Screenshots at key points
   - Error messages (if any)
   - Output data and results

### 8.3 Performance Reports

Generate and export performance reports:

1. Navigate to "Reports" in the sidebar
2. Select report type and date range
3. Click "Generate Report"
4. View online or download as PDF/CSV

## 9. Advanced Features

### 9.1 AI Workflow Suggestions

The platform analyzes your usage patterns to suggest optimized workflows:

- **Pattern Recognition**: Identifies repetitive tasks
- **Industry-Specific Templates**: Tailored to your business sector
- **ROI Estimation**: Projected time and cost savings
- **Confidence Scoring**: AI confidence in each suggestion

To use this feature:

1. Navigate to the Dashboard
2. Review the "Suggested Workflows" section
3. Click "Use Suggestion" to implement

### 9.2 Collaborative Workspace

For team environments:

- **Shared Workflows**: Create and share workflows with team members
- **Task Assignment**: Assign tasks to specific team members
- **Permission Management**: Control access to sensitive automations
- **Activity Tracking**: Monitor team usage and performance

### 9.3 API Integration

Integrate Buddhi Flow with other systems:

1. Navigate to "Settings" > "API"
2. Generate an API key
3. Use the provided documentation to integrate with your systems
4. Available endpoints include:
   - Task creation and management
   - Result retrieval
   - Workflow execution
   - Scheduled task management

## 10. Troubleshooting

### 10.1 Common Issues

#### Task Fails to Start
- Verify your API key is valid and has sufficient credits
- Check for any domain restrictions that might be blocking execution
- Ensure the task instructions are clear and actionable

#### Browser Automation Issues
- Check if the target website has anti-automation measures
- Try using a different browser profile with proxy enabled
- Simplify the task instructions and break into smaller steps

#### Scheduling Problems
- Verify the cron expression is correctly formatted
- Check timezone settings for scheduled tasks
- Ensure the scheduled task is enabled

### 10.2 Getting Support

If you encounter issues:

1. Check the Knowledge Base for solutions
2. Contact support via:
   - In-app chat support
   - Email: support@buddhiflow.com
   - Support ticket system

### 10.3 Providing Feedback

We value your feedback:

- Use the "Feedback" button in the app
- Join our user community for discussions
- Participate in beta testing for new features 