# Buddhi Flow - Implementation Guide

This guide provides detailed instructions for implementing and extending the Buddhi Flow platform.

## 1. Development Environment Setup

### 1.1 Prerequisites
- Node.js 18+ and npm/yarn
- Git
- Code editor (VS Code recommended)
- Browser Use API key

### 1.2 Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd buddhi-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Browser Use API key:
   ```
   BROWSER_USE_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 2. Project Structure

### 2.1 Core Directories

- **`src/app`**: Next.js app router pages and layouts
- **`src/components`**: React components
- **`src/contexts`**: React context providers
- **`src/hooks`**: Custom React hooks
- **`src/lib`**: Utility functions and API clients
- **`src/models`**: Data models and type definitions
- **`src/config`**: Configuration files
- **`public`**: Static assets

### 2.2 Key Files

- **`src/app/page.tsx`**: Landing page component
- **`src/app/layout.tsx`**: Root layout component
- **`src/components/ModernAgentInterface.tsx`**: Main agent interface
- **`src/components/Dashboard.tsx`**: Dashboard component
- **`src/components/TasksPage.tsx`**: Tasks management page
- **`src/lib/browserUseApi.ts`**: Browser Use API client

## 3. Core Features Implementation

### 3.1 Browser Profile Management

The Browser Profile Management system allows users to create and manage browser profiles with custom settings.

#### Key Components:
- `BrowserProfilesPage.tsx`: Main management interface
- `CreateBrowserProfileModal.tsx`: Profile creation modal
- `EditBrowserProfileModal.tsx`: Profile editing modal

#### Implementation Steps:

1. **Create the data model**
   ```typescript
   // src/models/BrowserProfile.ts
   export interface BrowserProfile {
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

2. **Implement API routes**
   ```typescript
   // src/app/api/browser-profiles/route.ts
   import { NextResponse } from 'next/server';
   
   export async function GET(request: Request) {
     // Fetch browser profiles from database
     // Return profiles list
   }
   
   export async function POST(request: Request) {
     // Create new browser profile
     // Return created profile
   }
   ```

3. **Create the UI components**
   - Implement the browser profiles page
   - Create modal components for profile creation and editing
   - Add form validation and error handling

### 3.2 Task Scheduling

The Task Scheduling system enables users to create and manage recurring automation tasks.

#### Key Components:
- `ScheduledTasksPage.tsx`: Main scheduled tasks interface
- `CreateScheduledTaskModal.tsx`: Task scheduling modal
- `EditScheduledTaskModal.tsx`: Schedule editing modal

#### Implementation Steps:

1. **Create the data model**
   ```typescript
   // src/models/ScheduledTask.ts
   export interface ScheduledTask {
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

2. **Implement API routes**
   ```typescript
   // src/app/api/scheduled-tasks/route.ts
   import { NextResponse } from 'next/server';
   
   export async function GET(request: Request) {
     // Fetch scheduled tasks from database
     // Return tasks list
   }
   
   export async function POST(request: Request) {
     // Create new scheduled task
     // Return created task
   }
   ```

3. **Create the UI components**
   - Implement the scheduled tasks page
   - Create modal components for task scheduling and editing
   - Add form validation and error handling
   - Implement scheduling options (interval, cron)

### 3.3 AI Workflow Suggestions

The AI Workflow Suggestions feature provides intelligent automation recommendations based on usage patterns.

#### Key Component:
- `WorkflowSuggestionsWidget.tsx`: Displays AI-generated workflow suggestions

#### Implementation Steps:

1. **Create the suggestion generation logic**
   ```typescript
   // src/lib/workflowSuggestions.ts
   export async function generateWorkflowSuggestions(userHistory: any[]) {
     // Analyze user history and patterns
     // Generate relevant workflow suggestions
     // Return suggestions with confidence scores
   }
   ```

2. **Implement the UI component**
   - Create the suggestions widget
   - Display suggestions with confidence scores
   - Add one-click implementation buttons
   - Implement filtering and categorization

## 4. API Integration

### 4.1 Browser Use API Client

The Browser Use API client handles communication with the Browser Use Cloud API.

#### Implementation:

```typescript
// src/lib/browserUseApi.ts
export class BrowserUseApiClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.browser-use.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  async runTask(taskData: any) {
    return this.request('/api/v1/run-task', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async getTaskStatus(taskId: string) {
    return this.request(`/api/v1/tasks/${taskId}`);
  }

  async createScheduledTask(taskData: any) {
    return this.request('/api/v1/scheduled-task', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // Add other API methods as needed
}
```

### 4.2 Webhook Integration

Implement webhook handling for receiving task status updates.

#### Implementation:

```typescript
// src/app/api/webhooks/browser-use/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  const body = await request.json();
  const timestamp = request.headers.get('X-Browser-Use-Timestamp');
  const signature = request.headers.get('X-Browser-Use-Signature');
  
  // Verify webhook signature
  const isValid = verifySignature(body, timestamp || '', signature || '', process.env.WEBHOOK_SECRET || '');
  
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  // Process webhook event
  const { type, payload } = body;
  
  if (type === 'agent.task.status_update') {
    // Update task status in database
    // Notify connected clients if needed
  }
  
  return NextResponse.json({ success: true });
}

function verifySignature(payload: any, timestamp: string, receivedSignature: string, secretKey: string): boolean {
  const message = `${timestamp}.${JSON.stringify(payload, null, 0)}`;
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(receivedSignature)
  );
}
```

## 5. UI Components

### 5.1 Creating New Components

Follow these guidelines when creating new UI components:

1. **Component Structure**
   ```tsx
   // src/components/ExampleComponent.tsx
   import React from 'react';
   import { cn } from '@/lib/utils';
   
   interface ExampleComponentProps {
     title: string;
     description?: string;
     className?: string;
   }
   
   export function ExampleComponent({
     title,
     description,
     className,
   }: ExampleComponentProps) {
     return (
       <div className={cn('rounded-lg p-4 bg-white/10 backdrop-blur-md', className)}>
         <h2 className="text-xl font-semibold">{title}</h2>
         {description && <p className="text-gray-200 mt-2">{description}</p>}
       </div>
     );
   }
   ```

2. **Styling Approach**
   - Use Tailwind CSS for styling
   - Use the `cn` utility for class name merging
   - Follow the existing design system

3. **Component Organization**
   - Place shared UI components in `src/components/ui`
   - Group feature-specific components in dedicated folders
   - Use index files for exporting multiple components

### 5.2 Form Handling

Implement forms using controlled components with proper validation:

```tsx
// Example form component
import React, { useState } from 'react';

export function TaskForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructions: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.instructions) newErrors.instructions = 'Instructions are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## 6. State Management

### 6.1 Context API

Use React Context API for global state management:

```tsx
// src/contexts/TaskContext.tsx
import React, { createContext, useContext, useReducer } from 'react';

// Define context types
type Task = {
  id: string;
  name: string;
  status: string;
  // other properties
};

type TaskState = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
};

type TaskAction = 
  | { type: 'FETCH_TASKS_START' }
  | { type: 'FETCH_TASKS_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_TASKS_ERROR'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string };

// Create context
const TaskContext = createContext<{
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
} | undefined>(undefined);

// Reducer function
function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'FETCH_TASKS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_TASKS_SUCCESS':
      return { ...state, loading: false, tasks: action.payload };
    case 'FETCH_TASKS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    default:
      return state;
  }
}

// Provider component
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    loading: false,
    error: null,
  });

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

// Custom hook for using the context
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
```

### 6.2 Custom Hooks

Create custom hooks for reusable logic:

```tsx
// src/hooks/useTaskExecution.ts
import { useState, useCallback } from 'react';
import { BrowserUseApiClient } from '@/lib/browserUseApi';

export function useTaskExecution(apiKey: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);

  const apiClient = new BrowserUseApiClient(apiKey);

  const executeTask = useCallback(async (taskData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.runTask(taskData);
      setTaskId(response.id);
      setTaskStatus('initializing');
      
      return response.id;
    } catch (err) {
      setError(err.message || 'Failed to execute task');
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const checkTaskStatus = useCallback(async (id: string) => {
    if (!id) return;
    
    try {
      const status = await apiClient.getTaskStatus(id);
      setTaskStatus(status.status);
      return status;
    } catch (err) {
      setError(err.message || 'Failed to check task status');
      return null;
    }
  }, [apiClient]);

  return {
    loading,
    error,
    taskId,
    taskStatus,
    executeTask,
    checkTaskStatus,
  };
}
```

## 7. Testing

### 7.1 Unit Testing

Use Jest and React Testing Library for unit testing:

```tsx
// src/components/__tests__/ExampleComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { ExampleComponent } from '../ExampleComponent';

describe('ExampleComponent', () => {
  it('renders the title correctly', () => {
    render(<ExampleComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(<ExampleComponent title="Test Title" description="Test Description" />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<ExampleComponent title="Test Title" />);
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });
});
```

### 7.2 API Mocking

Mock API calls for testing:

```tsx
// src/lib/__mocks__/browserUseApi.ts
export const mockRunTask = jest.fn();
export const mockGetTaskStatus = jest.fn();

export class BrowserUseApiClient {
  runTask = mockRunTask;
  getTaskStatus = mockGetTaskStatus;
}
```

## 8. Deployment

### 8.1 Vercel Deployment

1. **Connect repository to Vercel**
   - Sign up for Vercel
   - Import your GitHub repository
   - Configure project settings

2. **Configure environment variables**
   - Add your Browser Use API key
   - Add any other required environment variables

3. **Deploy**
   - Vercel will automatically deploy your application
   - Each push to the main branch will trigger a new deployment

### 8.2 Other Deployment Options

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy
```

#### Docker
```bash
# Build Docker image
docker build -t buddhi-flow .

# Run Docker container
docker run -p 3000:3000 -e BROWSER_USE_API_KEY=your_api_key buddhi-flow
```

## 9. Performance Optimization

### 9.1 Code Splitting

Implement code splitting for better performance:

```tsx
// src/app/page.tsx
import dynamic from 'next/dynamic';

// Dynamically import heavy components
const Dashboard = dynamic(() => import('@/components/Dashboard'), {
  loading: () => <p>Loading dashboard...</p>,
});

const ModernAgentInterface = dynamic(() => import('@/components/ModernAgentInterface'), {
  loading: () => <p>Loading agent interface...</p>,
});

export default function Home() {
  return (
    <main>
      {/* Other components */}
      <Dashboard />
      <ModernAgentInterface />
    </main>
  );
}
```

### 9.2 Image Optimization

Optimize images using Next.js Image component:

```tsx
import Image from 'next/image';

export function OptimizedImage() {
  return (
    <Image
      src="/path/to/image.jpg"
      alt="Description"
      width={500}
      height={300}
      priority
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
```

## 10. Security Best Practices

### 10.1 API Key Management

Store API keys securely:

- Use environment variables for API keys
- Never expose API keys in client-side code
- Implement server-side API proxies

### 10.2 Input Validation

Validate all user inputs:

```typescript
// Example input validation
function validateTaskInput(input: any) {
  const errors = {};
  
  if (!input.task || input.task.trim() === '') {
    errors.task = 'Task instructions are required';
  }
  
  if (input.max_agent_steps && (input.max_agent_steps < 1 || input.max_agent_steps > 200)) {
    errors.max_agent_steps = 'Max agent steps must be between 1 and 200';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

### 10.3 CORS Configuration

Configure CORS for API routes:

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // CORS headers
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
``` 