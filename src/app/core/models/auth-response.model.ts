export interface AuthResponse {
  success: boolean;
  message: string;

  token: string;
  refreshToken: string;
  expiresAt: string;

  email: string;
  userId: string;
  tenantId: string;

  roles: string[];
}
