import { API_CONFIG, HTTP_STATUS, HTTP_METHODS, APIResponse } from '../config/api';

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 0,
    public endpoint?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// HTTP Client for API requests
export class HTTPClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL?: string, timeout?: number) {
    this.baseURL = baseURL || API_CONFIG.BASE_URL;
    this.timeout = timeout || API_CONFIG.TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const token = localStorage.getItem('token');
    
    const defaultOptions: RequestInit = {
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        // Add Authorization header if token exists
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...defaultOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new APIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          endpoint
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new APIError(
          `Request timeout after ${this.timeout}ms`,
          HTTP_STATUS.SERVICE_UNAVAILABLE,
          endpoint,
          error
        );
      }

      throw new APIError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        0,
        endpoint,
        error instanceof Error ? error : undefined
      );
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: HTTP_METHODS.GET });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: HTTP_METHODS.DELETE });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: HTTP_METHODS.PATCH,
      body: JSON.stringify(data),
    });
  }

  // Method to handle API responses with standard format
  async requestWithResponse<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    return this.request<APIResponse<T>>(endpoint, options);
  }

  // Method to extract data from API response
  async requestData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await this.requestWithResponse<T>(endpoint, options);
    return response.data;
  }
}

// Export singleton instance
export const httpClient = new HTTPClient();
