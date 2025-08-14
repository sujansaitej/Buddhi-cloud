# Buddhi Flow - Technical Specification Document

## 1. Architecture Overview

### 1.1 System Architecture
Buddhi Flow is built as a modern web application using Next.js 14 with React 18 and TypeScript. The application follows a client-server architecture with the frontend handling the user interface and the backend integrating with the Browser Use Cloud API for browser automation.

### 1.2 Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **State Management**: React Context API with useReducer
- **Styling**: Tailwind CSS with custom utilities
- **Icons**: Lucide React
- **Markdown Rendering**: React Markdown with remark-gfm
- **Backend Integration**: Browser Use Cloud API
- **Database**: MongoDB/Mongoose (for data persistence)

### 1.3 Directory Structure
```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── workflow/         # Workflow-related components
│   ├── wallet/           # Credential wallet components
│   └── ...               # Other component files
├── config/                # Configuration files
├── context/               # React context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
└── models/                # Data models
```

## 2. Component Specifications

### 2.1 Core Components

#### 2.1.1 ModernAgentInterface
- **Purpose**: Main interface for interacting with the automation agent
- **Features**: 
  - Natural language input
  - Real-time task visualization
  - Split view with chat and browser
  - Task history and status tracking

#### 2.1.2 Dashboard
- **Purpose**: Main dashboard showing task statistics and templates
- **Features**:
  - Quick stats display (tasks, credits, success rate)
  - Template gallery
  - Recent tasks list
  - Workflow suggestions

#### 2.1.3 TasksPage
- **Purpose**: Comprehensive task management interface
- **Features**:
  - Task listing with filters and search
  - Task creation and editing
  - Task execution controls
  - Detailed task information

#### 2.1.4 BrowserProfilesPage
- **Purpose**: Browser profile management
- **Features**:
  - Profile creation and editing
  - Profile settings configuration
  - Profile selection for tasks
  - Profile templates

### 2.2 Advanced Components

#### 2.2.1 WorkflowSuggestionsWidget
- **Purpose**: AI-powered workflow recommendations
- **Features**:
  - Pattern-based suggestions
  - Industry-specific templates
  - Confidence scoring
  - ROI estimation

#### 2.2.2 AutomationHealthDashboard
- **Purpose**: Monitoring and analytics for automation performance
- **Features**:
  - Real-time metrics display
  - Performance tracking
  - Alert system
  - Historical trends visualization

#### 2.2.3 ScheduledTasksPage
- **Purpose**: Management of scheduled and recurring tasks
- **Features**:
  - Schedule creation and editing
  - Interval and cron scheduling
  - Status management
  - Execution history

## 3. API Integration

### 3.1 Browser Use Cloud API
The application integrates with the Browser Use Cloud API for browser automation capabilities. Key endpoints include:

#### 3.1.1 Task Management
- `POST /api/v1/run-task`: Create and execute a new automation task
- `GET /api/v1/tasks/{id}`: Get task status and details
- `GET /api/v1/tasks`: List all tasks with filtering options

#### 3.1.2 Scheduled Tasks
- `POST /api/v1/scheduled-task`: Create a new scheduled task
- `GET /api/v1/scheduled-tasks`: List all scheduled tasks
- `PUT /api/v1/scheduled-tasks/{id}`: Update a scheduled task
- `DELETE /api/v1/scheduled-tasks/{id}`: Delete a scheduled task

#### 3.1.3 Webhook Integration
- Support for webhook notifications for task status updates
- Signature verification for webhook security

### 3.2 Internal API Routes

#### 3.2.1 Browser Profiles
- `GET /api/browser-profiles`: List all profiles
- `POST /api/browser-profiles`: Create a new profile
- `PUT /api/browser-profiles/{id}`: Update a profile
- `DELETE /api/browser-profiles/{id}`: Delete a profile

#### 3.2.2 Scheduled Tasks
- `GET /api/scheduled-tasks`: List all scheduled tasks
- `POST /api/scheduled-tasks`: Create a new scheduled task
- `PUT /api/scheduled-tasks/{id}`: Update a scheduled task
- `DELETE /api/scheduled-tasks/{id}`: Delete a scheduled task

## 4. Data Models

### 4.1 Browser Profile
```typescript
interface BrowserProfile {
  id: string;
  name: string;
  description?: string;
  viewportWidth: number;
  viewportHeight: number;
  useAdblock: boolean;
  useProxy: boolean;
  proxyCountryCode?: string;
  saveBrowserData: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 Task
```typescript
interface Task {
  id: string;
  name: string;
  description: string;
  instructions: string;
  status: 'pending' | 'running' | 'finished' | 'failed' | 'paused' | 'stopped';
  browserProfileId?: string;
  allowedDomains?: string[];
  structuredOutputSchema?: string;
  llmModel: string;
  saveBrowserData: boolean;
  useAdblock: boolean;
  useProxy: boolean;
  proxyCountryCode?: string;
  highlightElements: boolean;
  maxAgentSteps: number;
  enablePublicShare: boolean;
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  results?: TaskResults;
}
```

### 4.3 Scheduled Task
```typescript
interface ScheduledTask {
  id: string;
  name: string;
  description?: string;
  task: string;
  scheduleType: 'interval' | 'cron';
  intervalMinutes?: number;
  cronExpression?: string;
  startAt: Date;
  endAt?: Date;
  active: boolean;
  lastRunAt?: Date;
  nextRunAt?: Date;
  browserProfileId?: string;
  allowedDomains?: string[];
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}
```

## 5. Security Considerations

### 5.1 Credential Management
- Secure storage of API keys and user credentials
- Encryption of sensitive data
- Role-based access control

### 5.2 API Security
- HTTPS for all API communications
- API key authentication
- Rate limiting and request validation
- Webhook signature verification

### 5.3 Browser Security
- Domain allowlisting for task execution
- Secure proxy connections
- Isolation of browser sessions
- Secure storage of browser data

## 6. Performance Optimization

### 6.1 Frontend Optimization
- Component code splitting
- Lazy loading of resources
- Optimized rendering with React
- Efficient state management

### 6.2 API Optimization
- Request batching
- Response caching
- Efficient data structures
- Pagination for large data sets

## 7. Testing Strategy

### 7.1 Unit Testing
- Component testing with React Testing Library
- Hook testing
- Utility function testing

### 7.2 Integration Testing
- API integration testing
- Component interaction testing
- State management testing

### 7.3 End-to-End Testing
- User flow testing
- Browser automation testing
- Performance testing

## 8. Deployment Strategy

### 8.1 Vercel Deployment
- Next.js optimized deployment
- Environment variable configuration
- Continuous integration and deployment
- Preview deployments for pull requests

### 8.2 Alternative Deployment Options
- Netlify deployment
- Railway deployment
- Docker containerization
- Custom server deployment 