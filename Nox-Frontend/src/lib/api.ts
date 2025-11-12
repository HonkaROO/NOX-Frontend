// Re-export everything from the new modular API structure
// This file maintains backward compatibility with existing imports

export { apiClient } from './api/client';

export type {
  LoginRequest,
  UserDto,
  CreateUserRequest,
  UpdateUserRequest,
  DepartmentDto,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DashboardStatisticsDto,
  MessageResponse,
} from './api/types';

// Export services for advanced usage
export { AuthService } from './api/authService';
export { UserService } from './api/userService';
export { DepartmentService } from './api/departmentService';
export { HttpClient } from './api/httpClient';
