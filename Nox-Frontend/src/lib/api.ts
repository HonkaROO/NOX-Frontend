// API client for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5164';

export interface LoginRequest {
  email: string;
  password: string;
}

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

export interface ManagerDto {
   id: string;
   email: string;
   fullName: string;
}

export interface DepartmentDto {
   id: number;
   name: string;
   description?: string;
   isActive: boolean;
   createdAt: string;
   updatedAt?: string;
   userCount: number;
   manager?: ManagerDto;
}

export interface CreateDepartmentRequest {
   name: string;
   description?: string;
   managerId?: string;
}

export interface UpdateDepartmentRequest {
   name?: string;
   description?: string;
   managerId?: string;
}

export interface AssignManagerRequest {
   managerId: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Handle responses with no content (like DELETE operations)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    return response.json();
  }

  // Authentication endpoints
  async login(data: LoginRequest): Promise<UserDto> {
    return this.request<UserDto>('/api/authentication/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/authentication/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<UserDto> {
     return this.request<UserDto>('/api/authentication/me');
   }

   // Department endpoints
   async getAllDepartments(): Promise<DepartmentDto[]> {
     return this.request<DepartmentDto[]>('/api/departments');
   }

   async getDepartmentById(id: number): Promise<DepartmentDto> {
     return this.request<DepartmentDto>(`/api/departments/${id}`);
   }

   async createDepartment(data: CreateDepartmentRequest): Promise<DepartmentDto> {
     return this.request<DepartmentDto>('/api/departments', {
       method: 'POST',
       body: JSON.stringify(data),
     });
   }

   async updateDepartment(id: number, data: UpdateDepartmentRequest): Promise<DepartmentDto> {
     return this.request<DepartmentDto>(`/api/departments/${id}`, {
       method: 'PUT',
       body: JSON.stringify(data),
     });
   }

   async assignManager(id: number, data: AssignManagerRequest): Promise<DepartmentDto> {
     return this.request<DepartmentDto>(`/api/departments/${id}/manager`, {
       method: 'PUT',
       body: JSON.stringify(data),
     });
   }

   async deleteDepartment(id: number): Promise<void> {
     return this.request<void>(`/api/departments/${id}`, {
       method: 'DELETE',
     });
   }
}

export const apiClient = new ApiClient(API_BASE_URL);