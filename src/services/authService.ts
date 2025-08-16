import { httpClient, APIError } from './httpClient';

// Types
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  avatarUrl?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// Authentication Service
class AuthService {
  private readonly AUTH_ENDPOINTS = {
    REGISTER: '/toeic/auth/register',
    LOGIN: '/toeic/auth/login',
    REFRESH: '/toeic/auth/refresh',
    PROFILE: '/toeic/auth/profile',
    LOGOUT: '/toeic/auth/logout',
  };

  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'currentUser';

  // Đăng ký tài khoản
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(this.AUTH_ENDPOINTS.REGISTER, data);
      
      // Lưu token và thông tin user
      this.setTokens(response.accessToken, response.refreshToken);
      this.setCurrentUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Đăng nhập
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(this.AUTH_ENDPOINTS.LOGIN, data);
      
      // Lưu token và thông tin user
      this.setTokens(response.accessToken, response.refreshToken);
      this.setCurrentUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Làm mới token
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new APIError('No refresh token available', 401);
      }

      const response = await httpClient.post<RefreshTokenResponse>(this.AUTH_ENDPOINTS.REFRESH, {
        refreshToken
      });

      // Cập nhật access token mới
      this.setAccessToken(response.accessToken);
      
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Nếu refresh token cũng hết hạn, đăng xuất user
      this.logout();
      throw error;
    }
  }

  // Lấy thông tin profile
  async getProfile(): Promise<User> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new APIError('No access token available', 401);
      }

      const response = await httpClient.get<User>(this.AUTH_ENDPOINTS.PROFILE);
      
      // Cập nhật thông tin user
      this.setCurrentUser(response);
      
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Đăng xuất
  async logout(): Promise<void> {
    try {
      const token = this.getAccessToken();
      if (token) {
        await httpClient.post(this.AUTH_ENDPOINTS.LOGOUT, {});
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Xóa tất cả thông tin authentication
      this.clearAuth();
    }
  }

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Lấy user hiện tại
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Lấy access token
  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Lấy refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Kiểm tra token có hết hạn không
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Lưu tokens
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  // Lưu access token
  private setAccessToken(accessToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
  }

  // Lưu thông tin user
  private setCurrentUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Xóa tất cả thông tin authentication
  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Kiểm tra quyền
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Kiểm tra có phải admin không
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Kiểm tra có phải teacher không
  isTeacher(): boolean {
    return this.hasRole('teacher');
  }

  // Kiểm tra có phải student không
  isStudent(): boolean {
    return this.hasRole('student');
  }
}

// Export singleton instance
export const authService = new AuthService();
