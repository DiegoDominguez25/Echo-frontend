import { API_CONFIG } from "@/config/api";

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export class BaseService {
  protected buildUrl(
    baseUrl: string,
    endpoint: string,
    params?: Record<string, string>
  ): string {
    let url = `${baseUrl}${endpoint}`;

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value);
      });
    }
    return url;
  }

  private getDefaultHeaders(
    customHeaders?: Record<string, string>
  ): Record<string, string> {
    return {
      Accept: "application/json",
      ...customHeaders,
    };
  }

  public async makeRequest<T>(
    mockData: T,
    baseUrl: string,
    endpoint: string,
    options?: RequestInit,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    if (API_CONFIG.USE_MOCK_API) {
      const mockDelay = API_CONFIG.MOCK_DELAYS.normal;
      await new Promise((resolve) => setTimeout(resolve, mockDelay));

      const method = options?.method || "GET";
      const status = method === "POST" ? 201 : method === "DELETE" ? 204 : 200;
      return {
        data: mockData,
        status,
        message: `${method} Success (Mock Data)`,
      };
    } else {
      const url = this.buildUrl(baseUrl, endpoint, params);

      const headers = this.getDefaultHeaders({
        "Content-Type": "application/json",
        ...(options?.headers as Record<string, string>),
      });

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(
          `API error! status: ${response.status} ${response.statusText}`
        );
      }

      const data = options?.method === "DELETE" ? null : await response.json();
      return {
        data: data,
        status: response.status,
        message: `${options?.method || "GET"} Success`,
      };
    }
  }

  public async makeFileRequest<T>(
    mockData: T,
    baseUrl: string,
    endpoint: string,
    formData: FormData,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    if (API_CONFIG.USE_MOCK_API) {
      const mockDelay = API_CONFIG.MOCK_DELAYS.audioAnalysis;
      await new Promise((resolve) => setTimeout(resolve, mockDelay));

      return {
        data: mockData,
        status: 200,
        message: "File upload completed (Mock)",
      };
    } else {
      const url = this.buildUrl(baseUrl, endpoint, params);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`File upload failed! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data: data,
        status: response.status,
        message: "File upload completed",
      };
    }
  }

  public async makeDataRequest<T>(
    mockData: T,
    endpoint: string,
    options?: RequestInit,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest(
      mockData,
      API_CONFIG.DATA_API.BASE_URL,
      endpoint,
      options,
      params
    );
  }

  public async makeUserRequest<T>(
    mockData: T,
    endpoint: string,
    options?: RequestInit,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest(
      mockData,
      API_CONFIG.USER_API.BASE_URL,
      endpoint,
      options,
      params
    );
  }

  public async makeAudioRequest<T>(
    mockData: T,
    endpoint: string,
    formData: FormData,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeFileRequest(
      mockData,
      API_CONFIG.AUDIO_ANALYSIS_API.BASE_URL,
      endpoint,
      formData,
      params
    );
  }
}

export const baseService = new BaseService();
