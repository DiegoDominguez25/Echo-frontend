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
    const stack = new Error().stack?.split("\n").slice(1, 4).join("\n");

    console.log("🔗 buildUrl called:", {
      baseUrl,
      endpoint,
      params,
      timestamp: new Date().toISOString(),
      caller: stack,
    });

    let url = `${baseUrl}${endpoint}`;

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        const before = url;
        url = url.replace(`:${key}`, encodeURIComponent(value));
        console.log(`🔧 Replaced :${key} with ${value}:`, {
          before,
          after: url,
        });
      });
    }

    console.log("✅ Final URL:", url);
    return url;
  }

  private _getAuthenticatedHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders || {});

    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  public async makeRequest<T>(
    baseUrl: string,
    endpoint: string,
    options: RequestInit = {},
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(baseUrl, endpoint, params);

    const headers = this._getAuthenticatedHeaders(options.headers);

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const detail = errorData?.detail || response.statusText;
      throw new Error(`API error! status: ${response.status} - ${detail}`);
    }

    const data = options?.method === "DELETE" ? null : await response.json();
    return {
      data: data,
      status: response.status,
      message: `${options?.method || "GET"} Success`,
    };
  }

  public async makeFileRequest<T>(
    baseUrl: string,
    endpoint: string,
    formData: FormData,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(baseUrl, endpoint, params);

    const headers = this._getAuthenticatedHeaders();

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const detail = errorData?.detail || response.statusText;
      throw new Error(
        `File upload failed! status: ${response.status} - ${detail}`
      );
    }

    const data = await response.json();
    return {
      data: data,
      status: response.status,
      message: "File upload completed",
    };
  }

  public async makeDataRequest<T>(
    endpoint: string,
    options?: RequestInit,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest(
      API_CONFIG.DATA_API.BASE_URL,
      endpoint,
      options,
      params
    );
  }

  public async makeUserRequest<T>(
    endpoint: string,
    options?: RequestInit,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest(
      API_CONFIG.USER_API.BASE_URL,
      endpoint,
      options,
      params
    );
  }

  public async makeAudioRequest<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    return this.makeFileRequest(
      API_CONFIG.AUDIO_ANALYSIS_API.BASE_URL,
      endpoint,
      formData
    );
  }

  public async makeEvaluationRequest<T>(
    endpoint: string,
    options?: RequestInit,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest(
      API_CONFIG.AUDIO_ANALYSIS_API.BASE_URL,
      endpoint,
      options,
      params
    );
  }
}

export const baseService = new BaseService();
