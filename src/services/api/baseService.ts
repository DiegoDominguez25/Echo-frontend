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

  private getDefaultHeaders(
    customHeaders?: Record<string, string>
  ): Record<string, string> {
    return {
      Accept: "application/json",
      ...customHeaders,
    };
  }

  public async makeRequest<T>(
    baseUrl: string,
    endpoint: string,
    options?: RequestInit,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
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

  public async makeFileRequest<T>(
    baseUrl: string,
    endpoint: string,
    formData: FormData,
    params?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    console.log("📤 FormData Debug:", {
      endpoint: `${baseUrl}${endpoint}`,
      formDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
        key,
        valueType: typeof value,
        valueSize: value instanceof File ? value.size : "N/A",
        fileName: value instanceof File ? value.name : "N/A",
        fileType: value instanceof File ? value.type : "N/A",
      })),
    });

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
