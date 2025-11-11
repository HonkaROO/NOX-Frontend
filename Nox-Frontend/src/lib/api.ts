// API client for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
}

export const apiClient = new ApiClient(API_BASE_URL);