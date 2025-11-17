import type { HttpClient } from './httpClient';
import type {
  UserDto,
  CreateUserRequest,
  UpdateUserRequest,
  DashboardStatisticsDto,
  MessageResponse
} from './types';

export class UserService {
  constructor(private http: HttpClient) {}

  async getAllUsers(): Promise<UserDto[]> {
    return this.http.get<UserDto[]>('/api/usermanagement');
  }

  async getUserById(userId: string): Promise<UserDto> {
    return this.http.get<UserDto>(`/api/usermanagement/${userId}`);
  }

  async createUser(data: CreateUserRequest): Promise<UserDto> {
    const cleanData = this.removeUndefinedValues(data);
    return this.http.post<UserDto>('/api/usermanagement', cleanData);
  }

  async updateUser(userId: string, data: UpdateUserRequest): Promise<UserDto> {
    const cleanData = this.removeUndefinedValues(data);
    return this.http.put<UserDto>(`/api/usermanagement/${userId}`, cleanData);
  }

  async deleteUser(userId: string): Promise<MessageResponse> {
    return this.http.delete<MessageResponse>(`/api/usermanagement/${userId}`);
  }

  async resetUserPassword(userId: string, newPassword: string): Promise<MessageResponse> {
    return this.http.post<MessageResponse>(
      `/api/usermanagement/${userId}/reset-password`,
      { newPassword }
    );
  }

  async getDashboardStatistics(): Promise<DashboardStatisticsDto> {
    return this.http.get<DashboardStatisticsDto>('/api/usermanagement/dashboard/statistics');
  }

  private removeUndefinedValues<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined)
    ) as Partial<T>;
  }
}
