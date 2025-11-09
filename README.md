# Issue Tracker Frontend

A modern, responsive frontend application for a mini issue tracking system built with Next.js. This application provides an intuitive user interface for managing issues, with features including authentication, issue creation, filtering, pagination, and real-time updates. Additionally, it includes bonus features for comment management and notification systems to enhance collaboration and activity tracking.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Authentication**: JWT tokens with HTTP-only cookies

## Project Structure

```
client/
├── app/
│   ├── (auth)/              # Authentication routes group
│   │   └── sign-in/         # Login page
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── issues/          # Issues pages
│   │   │   ├── [id]/        # Issue detail page
│   │   │   ├── my-issues/   # User's assigned issues
│   │   │   ├── mentioned/   # Issues where user is mentioned
│   │   │   ├── summary/     # Issue statistics and summary
│   │   │   ├── new/         # Create issue page
│   │   │   └── page.tsx     # Issues list page
│   │   ├── notifications/   # Notifications page (bonus)
│   │   │   └── page.tsx
│   │   ├── layout.tsx       # Dashboard layout
│   │   └── page.tsx         # Dashboard home
│   ├── layout.tsx           # Root layout
│   ├── not-found.tsx        # 404 page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── NotificationBell.tsx  # Notification bell component (bonus)
│   │   ├── Pagination.tsx
│   │   ├── Select.tsx
│   │   └── UserSelect.tsx
│   ├── comments/            # Comment components (bonus)
│   │   ├── CommentInput.tsx
│   │   ├── CommentItem.tsx
│   │   └── CommentsSection.tsx
│   ├── issues/              # Issue-specific components
│   │   ├── IssueCard.tsx
│   │   ├── IssueDetail.tsx
│   │   ├── IssueFilters.tsx
│   │   ├── IssueForm.tsx
│   │   └── IssueTable.tsx
│   └── layout/              # Layout components
│       ├── LayoutWrapper.tsx
│       ├── Navbar.tsx
│       └── Sidebar.tsx
├── lib/
│   ├── api.ts               # API client with interceptors
│   ├── socket.ts            # Socket.io client (bonus - removed)
│   └── utils.ts             # Utility functions
├── store/
│   └── authStore.ts         # Zustand authentication store
├── types/
│   ├── comment.ts           # Comment type definitions (bonus)
│   ├── issue.ts             # Issue type definitions
│   ├── notification.ts      # Notification type definitions (bonus)
│   └── user.ts              # User type definitions
├── middleware.ts            # Next.js middleware for route protection
└── tailwind.config.ts       # Tailwind CSS configuration
```

## API Endpoints

The frontend consumes the following backend API endpoints:

### Authentication (`/api/auth`)

- `POST /api/auth/login` - User login with email
- `POST /api/auth/logout` - User logout

### Users (`/api/users`)

- `GET /api/users/all-users` - Fetch all users for assignee dropdown

### Issues (`/api/issues`)

- `POST /api/issues` - Create a new issue
- `GET /api/issues` - List all issues with optional filters and pagination
- `GET /api/issues/my-issues` - Get issues assigned to logged-in user
- `GET /api/issues/summary` - Get issue statistics and summary
- `GET /api/issues/:id` - Get a single issue by ID
- `PATCH /api/issues/:id` - Update an issue (status, assignee, title, description, priority)

### Bonus Features

The following endpoints were implemented as bonus features to enhance collaboration and activity tracking:

#### Comments (`/api/comments`)

- `POST /api/comments` - Create a new comment on an issue
- `GET /api/comments/issue/:issueId` - Get all comments for a specific issue
- `PATCH /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment

#### Notifications (`/api/notifications`)

- `GET /api/notifications` - Get all notifications for the logged-in user (with pagination)
- `PATCH /api/notifications/:id/read` - Mark a specific notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read

## Features

### Authentication

- Email-based login system
- JWT token management with HTTP-only cookies
- Protected routes with Next.js middleware
- Automatic redirect for authenticated/unauthenticated users
- Persistent session with Zustand state management

### Issue Management

- **Create Issue**: Form with validation for title, description, priority, status, and assignee
- **List Issues**: Table and card views with pagination (10 issues per page)
- **Filter Issues**: Filter by status, priority, and assignee
- **My Issues**: Dedicated page showing issues assigned to the logged-in user
- **Issue Details**: View full issue information with inline editing for status, assignee, and priority
- **Empty States**: User-friendly empty states when no issues are found
- **Loading States**: Professional loading spinners during data fetching

### Bonus Features

#### Comments & Activity

- **Comment System**: Add comments to issues for better collaboration and activity tracking
- **User Mentions**: Mention users in comments using `@username` syntax with visual highlighting
- **Comment Management**: Full CRUD operations for comments (create, read, update, delete)
- **Activity Tracking**: View all comments and activity on issue detail pages
- **Real-time Updates**: Comments are displayed immediately after creation

#### Notifications

- **Notification Bell**: Notification bell icon in navbar with unread count badge
- **Notification Center**: Dedicated notifications page with pagination (10 per page)
- **Notification Types**: Receive notifications for issue creation, assignments, updates, status changes, priority changes, comments, and mentions
- **Read/Unread Status**: Mark individual notifications or all notifications as read
- **Notification Links**: Click notifications to navigate directly to related issues
- **Unread Count**: Real-time unread notification count displayed in the notification bell

### UI/UX

- Modern, responsive design with custom color scheme
- Smooth animations and transitions
- Professional sidebar and navbar navigation
- Mobile-responsive layout (table view on desktop, card view on mobile)
- Accessible components with proper ARIA labels
- Custom dropdown components with enhanced UI

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory (see Environment Variables section below).

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

Create a `.env.local` file in the `client/` directory with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Required Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: http://localhost:5000/api)

## Component Architecture

### Reusable UI Components (`components/ui/`)

The application follows a modular component architecture with reusable UI components:

- **Avatar** - User profile image display with fallback
- **Badge** - Status and priority indicators
- **Button** - Consistent button styling with variants (primary, outline, ghost)
- **Card** - Container component for content sections
- **EmptyState** - Empty state display with icon, title, description, and action
- **Input** - Form input with error handling
- **LoadingSpinner** - Loading indicator with size variants
- **Pagination** - Professional pagination controls with page navigation
- **Select** - Custom dropdown component with smooth animations
- **UserSelect** - Specialized dropdown for user selection with avatars

### Feature Components (`components/issues/`)

Issue-specific components that handle business logic:

- **IssueCard** - Mobile-friendly issue card display
- **IssueDetail** - Detailed issue view with inline editing
- **IssueFilters** - Filter controls for status, priority, and assignee
- **IssueForm** - Create and edit issue form with validation
- **IssueTable** - Desktop table view for issues list

### Bonus Components

#### Comment Components (`components/comments/`)

Comment and activity tracking components (bonus feature):

- **CommentInput** - Input component for creating new comments with mention support
- **CommentItem** - Individual comment display with author info and actions
- **CommentsSection** - Complete comments section with list and input

#### Notification Components (`components/ui/`)

- **NotificationBell** - Notification bell icon with dropdown and unread count badge (bonus feature)

### Layout Components (`components/layout/`)

- **LayoutWrapper** - Main layout wrapper with sidebar and navbar
- **Navbar** - Top navigation bar with user info and logout
- **Sidebar** - Side navigation with active state management

## Pages

### Authentication

- **Sign In** (`/sign-in`) - Email-based login page

### Dashboard

- **Home** (`/`) - Dashboard overview (redirects to issues)
- **Issues List** (`/issues`) - All issues with filters and pagination
- **My Issues** (`/issues/my-issues`) - Issues assigned to logged-in user
- **Mentioned Issues** (`/issues/mentioned`) - Issues where user is mentioned in comments
- **Issue Summary** (`/issues/summary`) - Issue statistics and summary dashboard
- **Create Issue** (`/issues/new`) - Create new issue form
- **Issue Detail** (`/issues/[id]`) - View and edit individual issue with comments

### Bonus Pages

- **Notifications** (`/notifications`) - View and manage all notifications (bonus feature)

### Error Pages

- **404 Not Found** - Custom not found page

## State Management

The application uses Zustand for state management:

- **Authentication Store** (`store/authStore.ts`):
  - User information
  - Authentication status
  - Login/logout functions
  - Persistent storage with localStorage

## API Client

The API client (`lib/api.ts`) includes:

- Axios instance with base configuration
- Request interceptor for adding JWT tokens
- Response interceptor for handling 401 errors
- Automatic token cleanup on logout
- Type-safe API methods for all endpoints

## Routing & Middleware

- **Next.js Middleware** (`middleware.ts`):
  - Protects dashboard routes from unauthenticated users
  - Redirects authenticated users away from sign-in page
  - Handles token validation

- **Route Groups**:
  - `(auth)` - Public authentication routes
  - `(dashboard)` - Protected dashboard routes with shared layout

## Styling

- **Tailwind CSS** with custom color scheme:
  - Primary: `#C4D9FF` - Buttons, highlights, active states
  - Secondary: `#C5BAFF` - Secondary buttons, badges, sidebar
  - Background: `#FBFBFB` - Main page background
  - Surface: `#E8F9FF` - Hover states, subtle panels
- Custom utility classes for consistent spacing and typography
- Responsive design with mobile-first approach

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production-ready application
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Key Features Implementation

### Pagination

- Server-side pagination with 10 issues per page
- Page navigation controls
- Display of current range and total count
- Smooth scroll to top on page change

### Filtering

- Real-time filtering by status, priority, and assignee
- Filter state persistence during navigation
- Reset to first page when filters change

### Inline Editing

- Edit issue status, assignee, and priority directly from detail page
- Optimistic UI updates
- Error handling with user feedback

### Responsive Design

- Desktop: Table view for issues list
- Mobile: Card view for better mobile experience
- Adaptive sidebar (collapsible on mobile)
- Touch-friendly interactive elements

## What I Would Improve If This Was Production

### Security Enhancements
- **Authentication**: Implement proper password-based authentication with bcrypt hashing, password reset flows, and session management instead of email-only login.
- **Rate Limiting**: Add rate limiting middleware (express-rate-limit) to prevent brute force attacks and API abuse.
- **JWT Security**: Implement token refresh mechanism, shorter token expiration, and secure token storage practices.

### Performance & Scalability
- **Caching Layer**: Implement Redis caching for frequently accessed data (user lists, issue summaries, notification counts).
- **Database Optimization**: Add compound indexes for common query patterns, implement query result pagination limits, and optimize aggregation pipelines.
- **API Response Optimization**: Implement field selection/projection to reduce payload sizes and improve response times.

### Error Handling & Logging
- **Centralized Error Handling**: Create global error handling middleware with structured error responses and proper HTTP status codes.
- **Structured Logging**: Replace console.log with a logging library (Winston, Pino) with log levels, file rotation, and structured JSON output.
- **Request Validation**: Use validation libraries (Joi, Zod, class-validator) to centralize and standardize input validation across controllers.

### Code Quality & Architecture
- **Transaction Support**: Use MongoDB transactions for multi-step operations (issue creation with notifications) to ensure data consistency.
