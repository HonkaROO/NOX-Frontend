# NOX-Frontend

NPAX-Onboarding eXpert Chatbot (Frontend) - React + TypeScript + Vite SPA

This is the frontend application for the NPAX-Onboarding eXpert Chatbot, providing a modern, responsive user interface for user authentication, user management, department organization, and AI-powered chatbot assistance. Built with React, TypeScript, and Vite.

**Technology Stack:** React 18 • TypeScript • Vite • TailwindCSS • React Router • Shadcn/ui

---

## Table of Contents

- [Quick Start](#quick-start)
- [Setup Instructions](#setup-instructions)
- [Development](#development)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Features](#features)
- [Authentication Flow](#authentication-flow)
- [Components Documentation](#components-documentation)
- [API Integration](#api-integration)
- [Common Scenarios](#common-scenarios)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- NOX-Backend running at `http://localhost:5164`

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5164
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at **`http://localhost:5173`**

### 4. Login with Default Credentials

**SuperAdmin Account:**
- Email: `superadmin@nox.local`
- Password: `SuperAdmin@2024!Nox`

---

## Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm (or yarn/pnpm)
- **NOX-Backend** API running on `http://localhost:5164`
- Modern web browser (Chrome, Firefox, Edge, Safari)

### 1. Clone and Install

```bash
# Navigate to frontend directory
cd NOX-Frontend/Nox-Frontend

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Backend API URL
VITE_API_URL=http://localhost:5164

# Optional: Other environment variables
# VITE_APP_NAME=NOX Chatbot
# VITE_ENV=development
```

**⚠️ Important:** The `VITE_API_URL` must match your backend server address.

### 3. Run Development Server

```bash
# Start Vite dev server (http://localhost:5173)
npm run dev

# OR with specific port
npm run dev -- --port 5174
```

The application will be available at:
- **Default:** `http://localhost:5173`
- **Custom port:** `http://localhost:<port>`

### 4. Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

Build output will be in the `dist/` directory.

---

## Development

### Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript type checking
npm run type-check

# Lint code
npm run lint

# Format code with Prettier
npm run format
```

### Development Workflow

1. **Start Backend:** Ensure NOX-Backend is running on `http://localhost:5164`
2. **Start Frontend:** Run `npm run dev`
3. **Hot Module Replacement:** Vite automatically reloads on file changes
4. **TypeScript Checking:** IDE shows type errors in real-time
5. **Browser DevTools:** Use React DevTools for component inspection

### Code Style

- **TypeScript:** Strict mode enabled
- **React:** Functional components with hooks
- **Styling:** TailwindCSS utility classes
- **Components:** Shadcn/ui component library
- **File naming:** PascalCase for components, camelCase for utilities

---

## Project Structure

```
NOX-Frontend/Nox-Frontend/
├── public/                          # Static assets (images, icons)
│   ├── SmileEmployees.png
│   ├── departmentsIcon.png
│   └── ...
│
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── SuperAdmin/              # SuperAdmin-specific components
│   │   │   ├── SearchBar.tsx        # Reusable search input
│   │   │   ├── UserTable.tsx        # User table component
│   │   │   ├── UserTableRow.tsx     # Individual user row
│   │   │   ├── UserManagementContent.tsx
│   │   │   └── index.ts             # Component exports
│   │   │
│   │   ├── modals/                  # Modal components
│   │   │   └── SuperAdminModals/
│   │   │       ├── UserModal.tsx    # Add/Edit user modal
│   │   │       ├── SuperAdminStats.tsx
│   │   │       └── SuperAdminNavigation.tsx
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   └── SuperAdminLayout/
│   │   │       └── SuperAdminHeader.tsx
│   │   │
│   │   ├── chatbotkilid/            # Chatbot components
│   │   │   └── ChatbotAssistant.tsx
│   │   │
│   │   └── ui/                      # Shadcn/ui primitives
│   │       ├── dialog.tsx
│   │       ├── button.tsx
│   │       └── ...
│   │
│   ├── pages/                       # Page components (routes)
│   │   ├── SuperAdminPages/
│   │   │   ├── SuperAdminUserManagement.tsx  # User management page
│   │   │   └── SuperAdminDashboard.tsx
│   │   │
│   │   ├── AdminPages/
│   │   │   └── HROverview.tsx
│   │   │
│   │   ├── UserPages/
│   │   │   └── UserDashboard.tsx
│   │   │
│   │   └── Auth/
│   │       ├── Login.tsx
│   │       └── Register.tsx
│   │
│   ├── lib/                         # Utilities and libraries
│   │   ├── api/                     # API client (modular)
│   │   │   ├── types.ts             # TypeScript interfaces
│   │   │   ├── httpClient.ts        # Base HTTP client
│   │   │   ├── authService.ts       # Authentication API
│   │   │   ├── userService.ts       # User management API
│   │   │   ├── departmentService.ts # Department API
│   │   │   ├── client.ts            # Main API client
│   │   │   ├── index.ts             # Exports
│   │   │   └── README.md            # API documentation
│   │   │
│   │   ├── api.ts                   # Legacy API exports (backward compat)
│   │   └── utils.ts                 # Utility functions
│   │
│   ├── hooks/                       # Custom React hooks
│   │   └── useUserManagement.ts     # User management hook
│   │
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # Application entry point
│   ├── index.css                    # Global styles (TailwindCSS)
│   └── vite-env.d.ts                # Vite type definitions
│
├── .env                             # Environment variables
├── .gitignore                       # Git ignore rules
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # TailwindCSS configuration
├── postcss.config.js                # PostCSS configuration
└── README.md                        # This file
```

---

## Architecture

### Component Architecture

The application follows a **modular component architecture** for scalability and maintainability:

#### 1. **Pages** (Route-level components)
- Located in `src/pages/`
- Mapped to routes via React Router
- Compose multiple smaller components
- Handle page-level state and data fetching

#### 2. **Feature Components** (Domain-specific)
- Located in `src/components/SuperAdmin/`, `src/components/Admin/`, etc.
- Reusable within specific feature domains
- Examples: `UserTable`, `SearchBar`, `UserManagementContent`

#### 3. **UI Components** (Primitive/Generic)
- Located in `src/components/ui/`
- Framework components from Shadcn/ui
- Highly reusable across all features
- Examples: `Dialog`, `Button`, `Input`

#### 4. **Layout Components**
- Located in `src/components/layout/`
- Provide consistent page structure
- Examples: `SuperAdminHeader`, `Sidebar`

#### 5. **Modal Components**
- Located in `src/components/modals/`
- Overlay dialogs for forms and actions
- Examples: `UserModal` (Add/Edit user)

### State Management

- **Local State:** `useState` for component-level state
- **Custom Hooks:** Encapsulate business logic (e.g., `useUserManagement`)
- **No Global State Library:** Cookie-based auth eliminates need for Redux/Zustand

### Routing

React Router v6 handles client-side routing:

```
/ → Login (public)
/superadmin/dashboard → SuperAdmin Dashboard (protected)
/superadmin/users → User Management (protected)
/admin/overview → Admin Dashboard (protected)
/user/dashboard → User Dashboard (protected)
```

### API Communication

- **API Client:** Modular service-based architecture
- **Authentication:** Cookie-based (handled by browser)
- **Error Handling:** Centralized in `httpClient.ts`
- **Type Safety:** Full TypeScript interfaces for all API responses

---

## Features

### 1. Authentication System
- Cookie-based login/logout
- Role-based access control (SuperAdmin, Admin, User)
- Protected routes with automatic redirects
- Session persistence (7-day cookie with sliding expiration)

### 2. User Management (SuperAdmin/Admin)
- View all users with search and filtering
- Create new users with role assignment
- Edit user profiles (name, department, contact info)
- Deactivate/delete user accounts
- Reset user passwords
- View user statistics and analytics

### 3. Department Management
- View all departments
- Create new departments
- Update department details
- Assign department managers
- Soft-delete departments

### 4. Dashboard & Analytics
- Total employees count
- Total departments count
- User distribution by department
- Role distribution statistics

### 5. Chatbot Assistant
- AI-powered onboarding assistant
- Context-aware responses
- Embedded in user management pages

### 6. Responsive Design
- Mobile-first approach
- Adaptive layouts for tablets and desktops
- Touch-friendly UI elements

---

## Authentication Flow

### Login Process

1. User enters email/password on Login page
2. Frontend calls `POST /api/authentication/login`
3. Backend validates credentials and returns user data
4. Browser stores authentication cookie (HttpOnly)
5. Frontend redirects to role-appropriate dashboard:
   - SuperAdmin → `/superadmin/dashboard`
   - Admin → `/admin/overview`
   - User → `/user/dashboard`

### Protected Routes

```typescript
// Automatic redirect if not authenticated
<Route path="/superadmin/*" element={<ProtectedRoute />}>
  <Route path="users" element={<SuperAdminUserManagement />} />
</Route>
```

### Logout Process

1. User clicks "Logout" button
2. Frontend calls `POST /api/authentication/logout`
3. Backend clears authentication cookie
4. Frontend redirects to `/login`

---

## Components Documentation

### SuperAdmin Components

Located in `src/components/SuperAdmin/`

#### **SearchBar** ([SearchBar.tsx](src/components/SuperAdmin/SearchBar.tsx))
Reusable search input component with icon.

**Props:**
- `value: string` - Current search query
- `onChange: (value: string) => void` - Change handler
- `placeholder?: string` - Input placeholder (default: "Search users..")

**Usage:**
```typescript
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search by name or email..."
/>
```

---

#### **UserTable** ([UserTable.tsx](src/components/SuperAdmin/UserTable.tsx))
Displays users in a table with sortable columns.

**Props:**
- `users: UserDto[]` - Array of user objects
- `onEdit: (type: UserModalType, user: UserDto) => void` - Edit handler
- `onDelete: (userId: string) => void` - Delete handler

**Features:**
- Responsive table layout
- User avatar with initials
- Department and role display
- Action buttons (Edit, Delete)

---

#### **UserTableRow** ([UserTableRow.tsx](src/components/SuperAdmin/UserTableRow.tsx))
Individual user row component.

**Props:**
- `user: UserDto` - User data object
- `onEdit: (type: UserModalType, user: UserDto) => void` - Edit handler
- `onDelete: (userId: string) => void` - Delete handler

**Features:**
- Confirmation dialog on delete
- Hover effects for better UX
- Accessibility labels

---

#### **UserManagementContent** ([UserManagementContent.tsx](src/components/SuperAdmin/UserManagementContent.tsx))
Main content area for user management page.

**Props:**
- `users: UserDto[]` - Array of users
- `onAddUser: () => void` - Add user handler
- `onEditUser: (type: UserModalType, user: UserDto) => void` - Edit handler
- `onDeleteUser: (userId: string) => void` - Delete handler

**Features:**
- Search functionality
- Add user button
- Integrates SearchBar and UserTable
- Chatbot assistant

---

### Modal Components

Located in `src/components/modals/SuperAdminModals/`

#### **UserModal** ([UserModal.tsx](src/components/modals/SuperAdminModals/UserModal.tsx))
Add/Edit user modal dialog.

**Props:**
- `open: boolean` - Modal open state
- `onOpenChange: (open: boolean) => void` - Close handler
- `type: 'add' | 'edit'` - Modal mode
- `user?: UserDto` - User data (for edit mode)
- `departments: DepartmentDto[]` - Available departments
- `onSave: (data: any) => void` - Save handler

**Features:**
- Form validation
- Add vs Edit modes
- Password field (add mode only)
- Username field (disabled in edit mode)
- Email field (disabled in edit mode)
- Department selection dropdown
- Employee ID and start date inputs

**Form Fields:**
- First Name (required)
- Last Name (required)
- Username (required for add, disabled for edit)
- Email (required, disabled for edit)
- Password (required for add, hidden for edit)
- Department (required, dropdown)
- Employee ID (optional)
- Phone (optional)
- Start Date (optional, date picker)
- Address (optional, textarea)

---

## API Integration

### API Client Architecture

The frontend uses a **modular API client** located in `src/lib/api/`. See [API Client README](src/lib/api/README.md) for full documentation.

#### Structure

```
src/lib/api/
├── types.ts              # TypeScript interfaces
├── httpClient.ts         # Base HTTP client
├── authService.ts        # Authentication endpoints
├── userService.ts        # User management endpoints
├── departmentService.ts  # Department endpoints
├── client.ts             # Main API client
└── index.ts              # Exports
```

#### Usage Examples

**Basic Usage (Backward Compatible):**
```typescript
import { apiClient } from '@/lib/api';

// Get all users
const users = await apiClient.getAllUsers();

// Create user
const newUser = await apiClient.createUser({
  userName: 'john.doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  firstName: 'John',
  lastName: 'Doe',
  departmentId: 2
});
```

**New Modular Usage:**
```typescript
import { apiClient } from '@/lib/api';

// Access services directly
const users = await apiClient.users.getAllUsers();
const currentUser = await apiClient.auth.getCurrentUser();
const departments = await apiClient.departments.getAllDepartments();
```

**Type Imports:**
```typescript
import type { UserDto, CreateUserRequest, DepartmentDto } from '@/lib/api';
```

---

### Custom Hooks

Located in `src/hooks/`

#### **useUserManagement** ([useUserManagement.ts](src/hooks/useUserManagement.ts))

Encapsulates all user management logic.

**Returns:**
```typescript
{
  users: UserDto[]
  departments: DepartmentDto[]
  loading: boolean
  error: string | null
  userModalOpen: boolean
  userModalType: 'add' | 'edit'
  selectedUser: UserDto | null
  setUserModalOpen: (open: boolean) => void
  handleUserModalOpen: (type: UserModalType, user?: UserDto) => void
  handleUserModalSave: (data: any) => Promise<void>
  handleDeleteUser: (userId: string) => Promise<void>
}
```

**Usage:**
```typescript
const {
  users,
  departments,
  loading,
  handleUserModalOpen,
  handleDeleteUser
} = useUserManagement();
```

**Benefits:**
- Separates business logic from UI
- Reusable across components
- Easy to test
- Reduces component complexity

---

## Common Scenarios

### Scenario 1: Login Flow

```typescript
// Login.tsx
import { apiClient } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const handleLogin = async (email: string, password: string) => {
  try {
    const user = await apiClient.login({ email, password });

    // Redirect based on role
    if (user.roles?.includes('SuperAdmin')) {
      navigate('/superadmin/dashboard');
    } else if (user.roles?.includes('Admin')) {
      navigate('/admin/overview');
    } else {
      navigate('/user/dashboard');
    }
  } catch (error) {
    alert(error.message);
  }
};
```

---

### Scenario 2: Create New User

```typescript
// Using useUserManagement hook
const { handleUserModalSave } = useUserManagement();

// In UserModal component, on form submit:
const formData = {
  userName: 'jane.smith',
  email: 'jane@example.com',
  password: 'SecurePass123!',
  firstName: 'Jane',
  lastName: 'Smith',
  departmentId: 3,
  phone: '+1-555-0123',
  employeeId: 'EMP-2024-001'
};

await handleUserModalSave(formData);
// User created, modal closes, user list refreshes
```

---

### Scenario 3: Search and Filter Users

```typescript
// UserManagementContent.tsx
const [searchQuery, setSearchQuery] = useState("");

const filteredUsers = users.filter((user) => {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase());
});

return (
  <>
    <SearchBar value={searchQuery} onChange={setSearchQuery} />
    <UserTable users={filteredUsers} onEdit={...} onDelete={...} />
  </>
);
```

---

### Scenario 4: Edit User Profile

```typescript
// Click edit button on user row
handleUserModalOpen('edit', user);

// UserModal opens with pre-filled data
// User updates fields and submits
const updateData = {
  firstName: 'UpdatedFirst',
  lastName: 'UpdatedLast',
  departmentId: 4,
  phone: '+1-555-9999'
};

await handleUserModalSave(updateData);
// User updated, modal closes, table refreshes
```

---

## Troubleshooting

### Port Already in Use (5173)

```bash
# Find process using the port
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or start on different port
npm run dev -- --port 5174
```

---

### CORS Errors

```
Access to fetch at 'http://localhost:5164/api/...' from origin 'http://localhost:5173'
has been blocked by CORS policy
```

**Solution:**
1. Ensure backend CORS is configured for `http://localhost:5173`
2. Check backend `Program.cs` has correct CORS policy
3. Verify `VITE_API_URL` in `.env` matches backend URL
4. See Backend CORS Setup Guide in NOX-Backend documentation

---

### API Connection Failed

```
Failed to fetch
```

**Solution:**
1. Verify backend is running: `curl http://localhost:5164/api/authentication/me`
2. Check `.env` file has correct `VITE_API_URL`
3. Restart dev server after changing `.env`: `npm run dev`

---

### TypeScript Errors

```
Cannot find module '@/lib/api' or its corresponding type declarations
```

**Solution:**
1. Check `tsconfig.json` has path alias configured:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```
2. Restart TypeScript server in IDE
3. Run type checking to see all errors

---

### Authentication Cookie Not Sent

**Solution:**
1. Ensure API client uses `credentials: 'include'`:
   ```typescript
   fetch(url, {
     credentials: 'include',
     ...
   })
   ```
2. Backend must set `Access-Control-Allow-Credentials: true`
3. Frontend and backend must have matching domain/subdomain for `SameSite=Strict`

---

### Build Errors

```
npm run build fails with TypeScript errors
```

**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

### Hot Reload Not Working

**Solution:**
1. Check Vite config for HMR settings
2. Restart dev server
3. Clear browser cache
4. Disable browser extensions that might interfere

---

## Additional Resources

### Documentation

- **[API Client Documentation](src/lib/api/README.md)** - Complete API client guide
- **[Backend API Documentation](../../NOX-Backend/README.md)** - Backend endpoint reference
- **[Vite Documentation](https://vitejs.dev/)** - Vite build tool
- **[React Router Documentation](https://reactrouter.com/)** - Routing library
- **[TailwindCSS Documentation](https://tailwindcss.com/)** - Utility CSS framework
- **[Shadcn/ui Documentation](https://ui.shadcn.com/)** - Component library

### Development Tools

- **React DevTools** - Browser extension for React debugging
- **Vite DevTools** - Vite-specific debugging
- **TypeScript Language Server** - IDE integration

---

## Performance Optimization

### Production Build

```bash
npm run build
```

**Optimizations:**
- Code splitting by route
- Tree shaking (removes unused code)
- Minification (CSS, JS)
- Asset compression
- CSS purging (TailwindCSS)

### Bundle Analysis

```bash
npm run build
npx vite-bundle-visualizer
```

View bundle size breakdown to identify optimization opportunities.

---

## License

This project is part of the NPAX platform. See LICENSE for details.

---

## Contributors

- Development Team - NPAX Engineering
- UI/UX Design - NPAX Design Team

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Changelog

### Version 1.0.0 (Current)

**Features:**
- ✅ User authentication system
- ✅ SuperAdmin user management
- ✅ Department management
- ✅ Role-based access control
- ✅ Responsive design
- ✅ Chatbot integration
- ✅ Modular API client architecture

**Coming Soon:**
- 📅 Admin dashboard enhancements
- 📅 User profile management
- 📅 Advanced search and filtering
- 📅 Batch user operations
- 📅 Audit logging UI
