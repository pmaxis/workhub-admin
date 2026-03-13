import { apiClient } from '@/shared/api/client';
import type { User } from '@/entities/user/types';
import type { LoginPayload, LoginResponse } from '../model/types';

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.postWithCredentials<LoginResponse>('/auth/login', payload),
  refresh: () => apiClient.postWithCredentials<LoginResponse>('/auth/refresh'),
  getUserById: (id: string) => apiClient.get<User>(`/users/${id}`),
  logout: () => apiClient.postWithCredentials('/auth/logout'),
};
