import { HttpClient } from './httpClient';
import { AuthService } from './authService';
import { UserService } from './userService';
import { DepartmentService } from './departmentService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  private httpClient: HttpClient;
  public auth: AuthService;
  public users: UserService;
  public departments: DepartmentService;

  constructor(baseURL: string) {
    this.httpClient = new HttpClient(baseURL);
    this.auth = new AuthService(this.httpClient);
    this.users = new UserService(this.httpClient);
    this.departments = new DepartmentService(this.httpClient);
  }

  // Legacy methods for backward compatibility
  async login(data: any) {
    return this.auth.login(data);
  }

  async logout() {
    return this.auth.logout();
  }

  async getCurrentUser() {
    return this.auth.getCurrentUser();
  }

  async getAllUsers() {
    return this.users.getAllUsers();
  }

  async getUserById(userId: string) {
    return this.users.getUserById(userId);
  }

  async createUser(data: any) {
    return this.users.createUser(data);
  }

  async updateUser(userId: string, data: any) {
    return this.users.updateUser(userId, data);
  }

  async deleteUser(userId: string) {
    return this.users.deleteUser(userId);
  }

  async resetUserPassword(userId: string, newPassword: string) {
    return this.users.resetUserPassword(userId, newPassword);
  }

  async getDashboardStatistics() {
    return this.users.getDashboardStatistics();
  }

  async getAllDepartments() {
    return this.departments.getAllDepartments();
  }

  async getDepartmentById(departmentId: number) {
    return this.departments.getDepartmentById(departmentId);
  }

  async createDepartment(data: any) {
    return this.departments.createDepartment(data);
  }

  async updateDepartment(departmentId: number, data: any) {
    return this.departments.updateDepartment(departmentId, data);
  }

  async deleteDepartment(departmentId: number) {
    return this.departments.deleteDepartment(departmentId);
  }

  async assignDepartmentManager(departmentId: number, managerId: string) {
    return this.departments.assignDepartmentManager(departmentId, managerId);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
