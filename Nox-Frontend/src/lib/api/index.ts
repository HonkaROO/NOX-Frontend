// Export the main API client
export { apiClient } from './client';

// Export all types
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
} from './types';

// Export services for advanced usage
export { AuthService } from './authService';
export { UserService } from './userService';
export { DepartmentService } from './departmentService';
export { HttpClient } from './httpClient';
