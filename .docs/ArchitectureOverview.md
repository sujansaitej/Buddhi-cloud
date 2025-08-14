# Buddhi Flow - Architecture Overview

This document provides a comprehensive overview of the Buddhi Flow platform architecture, explaining the system design, component interactions, and technical decisions.

## 1. System Architecture

### 1.1 High-Level Architecture

Buddhi Flow follows a modern web application architecture with the following key components:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js Frontend                        │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │    Pages    │  │  Components │  │      API Routes         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                          │
│                                                                 │
│  ┌─────────────────┐  ┌───────────────┐  ┌──────────────────┐   │
│  │ Browser Use API │  │ MongoDB Atlas │  │ Other Services   │   │
│  └─────────────────┘  └───────────────┘  └──────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Key Components

1. **Frontend (Next.js Application)**
   - User interface and client-side logic
   - Server-side rendering for improved performance
   - API routes for backend functionality

2. **Browser Use Cloud API**
   - External service for browser automation
   - Handles browser session management
   - Executes automation instructions
   - Provides real-time status updates

3. **Database (MongoDB)**
   - Stores user data and settings
   - Manages browser profiles
   - Tracks task history and results
   - Stores scheduled tasks

4. **Webhook System**
   - Receives real-time updates from Browser Use API
   - Updates task status and results
   - Triggers notifications and alerts

## 2. Frontend Architecture

### 2.1 Next.js App Router Structure

The application uses Next.js 14 with the App Router pattern:

```
src/
└── app/
    ├── api/                  # API routes
    │   ├── browser-profiles/
    │   ├── scheduled-tasks/
    │   └── webhooks/
    ├── dashboard/            # Dashboard page
    ├── tasks/                # Tasks management page
    ├── scheduled-tasks/      # Scheduled tasks page
    ├── browser-profiles/     # Browser profiles page
    ├── workflows/            # Workflows page
    ├── wallet/               # Credential wallet page
    ├── templates/            # Templates page
    ├── globals.css           # Global styles
    ├── layout.tsx            # Root layout
    └── page.tsx              # Landing page
```

### 2.2 Component Architecture

The component structure follows a modular design:

```
src/
└── components/
    ├── ui/                   # Reusable UI components
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   ├── Modal.tsx
    │   └── ...
    ├── workflow/             # Workflow-related components
    │   ├── WorkflowCard.tsx
    │   ├── WorkflowEditor.tsx
    │   └── ...
    ├── wallet/               # Credential wallet components
    │   ├── CredentialForm.tsx
    │   ├── CredentialList.tsx
    │   └── ...
    ├── ModernAgentInterface.tsx
    ├── Dashboard.tsx
    ├── TasksPage.tsx
    ├── TaskDetails.tsx
    ├── TaskCreationModal.tsx
    ├── BrowserProfilesPage.tsx
    ├── CreateBrowserProfileModal.tsx
    ├── EditBrowserProfileModal.tsx
    ├── ScheduledTasksPage.tsx
    ├── CreateScheduledTaskModal.tsx
    ├── EditScheduledTaskModal.tsx
    ├── WorkflowSuggestionsWidget.tsx
    ├── AutomationHealthDashboard.tsx
    ├── CollaborativeWorkspace.tsx
    ├── Header.tsx
    ├── Sidebar.tsx
    └── ...
```

### 2.3 State Management

The application uses a combination of state management approaches:

1. **React Context API**
   - Global state management
   - Context providers for different domains (tasks, profiles, etc.)
   - Reducer pattern for complex state logic

2. **Local Component State**
   - Component-specific state using useState
   - Form state management
   - UI interaction state

3. **Server State**
   - Data fetching and caching
   - API integration
   - Real-time updates

## 3. Backend Architecture

### 3.1 API Routes

Next.js API routes provide backend functionality:

```
src/
└── app/
    └── api/
        ├── browser-profiles/
        │   ├── route.ts              # GET, POST handlers
        │   └── [id]/
        │       └── route.ts          # GET, PUT, DELETE handlers
        ├── scheduled-tasks/
        │   ├── route.ts              # GET, POST handlers
        │   └── [id]/
        │       └── route.ts          # GET, PUT, DELETE handlers
        ├── tasks/
        │   ├── route.ts              # GET, POST handlers
        │   └── [id]/
        │       └── route.ts          # GET, PUT, DELETE handlers
        └── webhooks/
            └── browser-use/
                └── route.ts          # Webhook handler
```

### 3.2 Data Models

Key data models in the application:

1. **Task**
   - Core entity for browser automation tasks
   - Contains instructions, settings, and results

2. **BrowserProfile**
   - Configuration for browser automation sessions
   - Includes viewport size, proxy settings, etc.

3. **ScheduledTask**
   - Extension of Task with scheduling information
   - Includes schedule type, interval, and status

4. **Workflow**
   - Reusable template for automation tasks
   - Contains parameterized instructions and metadata

5. **Credential**
   - Securely stored authentication information
   - Used for automating authenticated workflows

### 3.3 External API Integration

The application integrates with the Browser Use Cloud API:

1. **API Client**
   - Handles authentication and request formatting
   - Manages API rate limiting and retries
   - Provides typed interfaces for API operations

2. **Webhook Handler**
   - Receives and verifies webhook events
   - Updates application state based on events
   - Triggers notifications and alerts

## 4. Database Architecture

### 4.1 MongoDB Schema

The application uses MongoDB with Mongoose for data persistence:

1. **User Schema**
   ```typescript
   {
     id: ObjectId,
     email: String,
     name: String,
     apiKey: String (encrypted),
     createdAt: Date,
     updatedAt: Date
   }
   ```

2. **BrowserProfile Schema**
   ```typescript
   {
     id: ObjectId,
     userId: ObjectId,
     name: String,
     description: String,
     viewportWidth: Number,
     viewportHeight: Number,
     useAdblock: Boolean,
     useProxy: Boolean,
     proxyCountryCode: String,
     saveBrowserData: Boolean,
     createdAt: Date,
     updatedAt: Date
   }
   ```

3. **Task Schema**
   ```typescript
   {
     id: ObjectId,
     userId: ObjectId,
     name: String,
     description: String,
     instructions: String,
     status: String,
     browserProfileId: ObjectId,
     allowedDomains: [String],
     structuredOutputSchema: String,
     llmModel: String,
     saveBrowserData: Boolean,
     useAdblock: Boolean,
     useProxy: Boolean,
     proxyCountryCode: String,
     highlightElements: Boolean,
     maxAgentSteps: Number,
     enablePublicShare: Boolean,
     metadata: Object,
     results: Object,
     createdAt: Date,
     updatedAt: Date
   }
   ```

4. **ScheduledTask Schema**
   ```typescript
   {
     id: ObjectId,
     userId: ObjectId,
     taskId: ObjectId,
     name: String,
     description: String,
     scheduleType: String,
     intervalMinutes: Number,
     cronExpression: String,
     startAt: Date,
     endAt: Date,
     active: Boolean,
     lastRunAt: Date,
     nextRunAt: Date,
     createdAt: Date,
     updatedAt: Date
   }
   ```

### 4.2 Data Access Patterns

The application uses the following data access patterns:

1. **Repository Pattern**
   - Abstracts database operations
   - Provides typed interfaces for data access
   - Handles data validation and transformation

2. **Service Layer**
   - Implements business logic
   - Coordinates between repositories
   - Handles complex operations spanning multiple entities

## 5. Authentication & Security

### 5.1 Authentication Flow

1. **User Authentication**
   - Email/password authentication
   - API key authentication for direct Browser Use users
   - Session management with secure cookies

2. **API Authentication**
   - Browser Use API key management
   - Secure storage of API keys
   - Server-side API proxying to protect keys

### 5.2 Security Measures

1. **Data Encryption**
   - Encryption of sensitive data (API keys, credentials)
   - Secure transmission with HTTPS
   - Environment variable protection

2. **Access Control**
   - Role-based access control
   - Resource ownership validation
   - API route protection

3. **Input Validation**
   - Request validation and sanitization
   - Protection against injection attacks
   - Rate limiting for API endpoints

4. **Webhook Security**
   - Signature verification for webhooks
   - Timestamp validation to prevent replay attacks
   - IP allowlisting for webhook sources

## 6. Deployment Architecture

### 6.1 Vercel Deployment

The application is optimized for deployment on Vercel:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel Platform                         │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Frontend   │  │ API Routes  │  │    Edge Functions      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                          │
│                                                                 │
│  ┌─────────────────┐  ┌───────────────┐  ┌──────────────────┐   │
│  │ Browser Use API │  │ MongoDB Atlas │  │ Other Services   │   │
│  └─────────────────┘  └───────────────┘  └──────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Environment Configuration

The application uses environment variables for configuration:

1. **Development Environment**
   - Local .env.local file
   - Development-specific settings
   - Mock services for testing

2. **Production Environment**
   - Vercel environment variables
   - Production API endpoints
   - Monitoring and logging integrations

### 6.3 CI/CD Pipeline

The application uses a continuous integration and deployment pipeline:

1. **GitHub Integration**
   - Code repository hosting
   - Pull request workflow
   - Code review process

2. **Automated Testing**
   - Unit tests for components and utilities
   - Integration tests for API routes
   - End-to-end tests for critical flows

3. **Preview Deployments**
   - Automatic preview deployments for pull requests
   - Environment-specific configurations
   - QA and testing on preview environments

4. **Production Deployment**
   - Automated deployment on merge to main branch
   - Rollback capabilities
   - Monitoring and alerting

## 7. Performance Optimization

### 7.1 Frontend Optimization

1. **Code Splitting**
   - Dynamic imports for route-based code splitting
   - Component-level code splitting for large components
   - Lazy loading for non-critical components

2. **Image Optimization**
   - Next.js Image component for optimized images
   - Responsive image loading
   - Image format optimization

3. **Rendering Strategies**
   - Server-side rendering for initial page load
   - Client-side rendering for interactive components
   - Static generation for static content

### 7.2 API Optimization

1. **Caching Strategies**
   - Response caching for frequently accessed data
   - Stale-while-revalidate pattern
   - Cache invalidation on data updates

2. **Request Batching**
   - Combining multiple API requests
   - Reducing round-trips to external APIs
   - Optimized data fetching patterns

3. **Pagination and Filtering**
   - Efficient pagination for large data sets
   - Server-side filtering and sorting
   - Cursor-based pagination for optimal performance

## 8. Monitoring & Logging

### 8.1 Error Tracking

1. **Client-side Error Tracking**
   - Global error boundary
   - Error reporting to monitoring service
   - User feedback collection on errors

2. **Server-side Error Tracking**
   - API route error handling
   - Structured error logging
   - Alert notifications for critical errors

### 8.2 Performance Monitoring

1. **Frontend Performance**
   - Core Web Vitals monitoring
   - User experience metrics
   - Performance regression detection

2. **API Performance**
   - Response time monitoring
   - Endpoint usage statistics
   - Resource consumption tracking

### 8.3 Usage Analytics

1. **User Behavior Analytics**
   - Feature usage tracking
   - User journey analysis
   - Conversion funnel monitoring

2. **System Usage Analytics**
   - API credit consumption
   - Task execution metrics
   - Resource utilization trends

## 9. Scalability Considerations

### 9.1 Horizontal Scaling

1. **Stateless Architecture**
   - Serverless functions for API routes
   - Distributed data storage
   - No session affinity requirements

2. **Load Distribution**
   - Edge function distribution
   - Global CDN for static assets
   - Regional data access optimization

### 9.2 Database Scaling

1. **MongoDB Atlas Scaling**
   - Automatic sharding for large data sets
   - Read replicas for read-heavy workloads
   - Connection pooling for efficient resource usage

2. **Query Optimization**
   - Indexed fields for common queries
   - Aggregation pipeline optimization
   - Data denormalization for read performance

### 9.3 API Scaling

1. **Rate Limiting**
   - User-based rate limiting
   - Graduated rate limits based on plan
   - Retry strategies with exponential backoff

2. **Concurrency Management**
   - Task queue for high-volume automation
   - Priority scheduling for premium users
   - Resource allocation based on task complexity 