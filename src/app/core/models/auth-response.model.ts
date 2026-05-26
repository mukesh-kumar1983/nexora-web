export interface AuthResponse {
  //token: string;
  refreshToken: string;
  expiresAt: string;
  success: boolean;
  message: string;
  data: any;
}