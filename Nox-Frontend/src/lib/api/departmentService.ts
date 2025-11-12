import type { HttpClient } from './httpClient';
import type {
  DepartmentDto,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  MessageResponse
} from './types';

export class DepartmentService {
  constructor(private http: HttpClient) {}

  async getAllDepartments(): Promise<DepartmentDto[]> {
    return this.http.get<DepartmentDto[]>('/api/departments');
  }

  async getDepartmentById(departmentId: number): Promise<DepartmentDto> {
    return this.http.get<DepartmentDto>(`/api/departments/${departmentId}`);
  }

  async createDepartment(data: CreateDepartmentRequest): Promise<DepartmentDto> {
    return this.http.post<DepartmentDto>('/api/departments', data);
  }

  async updateDepartment(departmentId: number, data: UpdateDepartmentRequest): Promise<DepartmentDto> {
    return this.http.put<DepartmentDto>(`/api/departments/${departmentId}`, data);
  }

  async deleteDepartment(departmentId: number): Promise<MessageResponse> {
    return this.http.delete<MessageResponse>(`/api/departments/${departmentId}`);
  }

  async assignDepartmentManager(departmentId: number, managerId: string): Promise<DepartmentDto> {
    return this.http.put<DepartmentDto>(
      `/api/departments/${departmentId}/manager`,
      { managerId }
    );
  }
}
