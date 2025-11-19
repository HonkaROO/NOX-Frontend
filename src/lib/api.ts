// Re-export everything from the new modular API structure
// This file maintains backward compatibility with existing imports

export { apiClient } from './api/USERS/client';

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
} from './api//USERS/types';

// Export services for advanced usage
export { AuthService } from './api/USERS/authService';
export { UserService } from './api/USERS/userService';
export { DepartmentService } from './api/USERS/departmentService';
export { HttpClient } from './api/USERS/httpClient';
