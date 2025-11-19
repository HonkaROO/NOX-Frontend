// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

// User types
export interface UserDto {
  id: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  startDate?: string;
  employeeId?: string;
  departmentId: number;
  departmentName?: string;
  isActive: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  updatedAt?: string;
  roles?: string[];
}

export interface CreateUserRequest {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  departmentId: number;
  startDate?: string;
  employeeId?: string;
  role?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  departmentId?: number;
  startDate?: string;
  employeeId?: string;
  role?: string;
}

// Department types
export interface DepartmentDto {
  id: number;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  isActive: boolean;
  userCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
}

// Dashboard types
export interface DashboardStatisticsDto {
  totalEmployees: number;
  totalDepartments: number;
}

// Common response types
export interface MessageResponse {
  message: string;
}
