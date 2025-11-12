# API Client Structure

This directory contains a modular, maintainable API client for the NOX application.

## Structure

```
api/
├── index.ts                 # Main exports
├── client.ts                # Main API client (combines all services)
├── httpClient.ts            # Base HTTP client with error handling
├── types.ts                 # All TypeScript interfaces and types
├── authService.ts           # Authentication endpoints
├── userService.ts           # User management endpoints
├── departmentService.ts     # Department management endpoints
└── README.md                # This file
```

## Usage

### Basic Usage (Backward Compatible)

```typescript
import { apiClient } from '@/lib/api';

// All existing code continues to work
const users = await apiClient.getAllUsers();
const user = await apiClient.createUser(userData);
```

### New Modular Usage

```typescript
import { apiClient } from '@/lib/api';

// Access services directly
const users = await apiClient.users.getAllUsers();
const currentUser = await apiClient.auth.getCurrentUser();
const departments = await apiClient.departments.getAllDepartments();
```

### Using Individual Services

```typescript
import { UserService, HttpClient } from '@/lib/api';

const httpClient = new HttpClient('http://localhost:5000');
const userService = new UserService(httpClient);

const users = await userService.getAllUsers();
```

### Type Imports

```typescript
import type { UserDto, CreateUserRequest, DepartmentDto } from '@/lib/api';
```

## Benefits

### 1. **Separation of Concerns**
- Each service handles its own domain (auth, users, departments)
- Easy to add new services without modifying existing ones

### 2. **Reusability**
- HttpClient can be used for any API endpoint
- Services can be instantiated independently for testing

### 3. **Type Safety**
- All types are centralized in `types.ts`
- Easy to find and update interfaces

### 4. **Maintainability**
- Small, focused files (50-100 lines each)
- Changes to one service don't affect others
- Easy to locate bugs and add features

### 5. **Testability**
- Services can be mocked easily
- HttpClient can be tested independently
- Each service has clear boundaries

### 6. **Backward Compatibility**
- Old imports from `@/lib/api` continue to work
- No breaking changes for existing code

## Adding New Endpoints

### 1. Add types to `types.ts`

```typescript
export interface NewFeatureDto {
  id: string;
  name: string;
}
```

### 2. Create a new service (or add to existing)

```typescript
// newFeatureService.ts
import type { HttpClient } from './httpClient';
import type { NewFeatureDto } from './types';

export class NewFeatureService {
  constructor(private http: HttpClient) {}

  async getFeatures(): Promise<NewFeatureDto[]> {
    return this.http.get<NewFeatureDto[]>('/api/features');
  }
}
```

### 3. Add to ApiClient in `client.ts`

```typescript
this.features = new NewFeatureService(this.httpClient);
```

### 4. Export from `index.ts`

```typescript
export { NewFeatureService } from './newFeatureService';
export type { NewFeatureDto } from './types';
```

## File Sizes (Before vs After)

- **Before**: 1 file, 226 lines
- **After**: 7 files, ~40-80 lines each
- **Maintainability**: ⬆️ Significantly improved
