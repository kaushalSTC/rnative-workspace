import { ApiClient } from './client';
import { User, CreateUserRequest, UpdateUserRequest, LoginRequest, AuthResponse } from '../types/user';

export class UserService {
  constructor(private apiClient: ApiClient) {}

  async getCurrentUser(): Promise<User> {
    return this.apiClient.get<User>('/user/profile');
  }

  async getUserById(id: string): Promise<User> {
    return this.apiClient.get<User>(`/users/${id}`);
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    return this.apiClient.put<User>(`/users/${id}`, data);
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    return this.apiClient.post<User>('/users', data);
  }

  async deleteUser(id: string): Promise<void> {
    return this.apiClient.delete(`/users/${id}`);
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.apiClient.post<AuthResponse>('/auth/login', credentials);
  }

  async logout(): Promise<void> {
    return this.apiClient.post('/auth/logout');
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.apiClient.post<AuthResponse>('/auth/refresh');
  }
}
