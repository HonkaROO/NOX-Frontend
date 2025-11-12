import type { HttpClient } from './httpClient';
import type { LoginRequest, UserDto, MessageResponse } from './types';

export class AuthService {
  constructor(private http: HttpClient) {}

  async login(data: LoginRequest): Promise<UserDto> {
    return this.http.post<UserDto>('/api/authentication/login', data);
  }

  async logout(): Promise<MessageResponse> {
    return this.http.post<MessageResponse>('/api/authentication/logout');
  }

  async getCurrentUser(): Promise<UserDto> {
    return this.http.get<UserDto>('/api/authentication/me');
  }
}
