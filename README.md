# Issue Tracker Frontend

A modern, responsive frontend application for a mini issue tracking system built with Next.js. This application provides an intuitive user interface for managing issues, with features including authentication, issue creation, filtering, pagination, and real-time updates.

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
│   │   │   ├── new/         # Create issue page
│   │   │   └── page.tsx     # Issues list page
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
│   │   ├── Pagination.tsx
│   │   ├── Select.tsx
│   │   └── UserSelect.tsx
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
│   └── utils.ts             # Utility functions
├── store/
│   └── authStore.ts         # Zustand authentication store
├── types/
│   ├── issue.ts             # Issue type definitions
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
- **Create Issue** (`/issues/new`) - Create new issue form
- **Issue Detail** (`/issues/[id]`) - View and edit individual issue

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
