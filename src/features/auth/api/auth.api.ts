import { apiClient } from '@/shared/api/client';
import type { User } from '@/entities/user/types';
import type { LoginPayload, LoginResponse } from '../model/types';

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.postWithCredentials<LoginResponse>('/auth/login', payload),

  /** Оновлення access token з httpOnly cookie refresh_token */
  refresh: () => apiClient.postWithCredentials<LoginResponse>('/auth/refresh'),

  /** Поточний користувач через userId з access token payload. */
  getUserById: (id: string) => apiClient.get<User>(`/users/${id}`),

  /** Вихід — інвалідує сесію на сервері (Bearer підставляється з auth getter). */
  logout: () => apiClient.postWithCredentials('/auth/logout'),
};
