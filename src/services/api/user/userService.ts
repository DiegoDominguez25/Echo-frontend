import { baseService } from "../baseService";
import { API_CONFIG } from "@/config/api";
import type { Users, UserApplication, Progress } from "@/data/types/UserData";

type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

export class UserService {
  private static instance: UserService;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async createAccount(accountData: {
    email: string;
    name: string;
    password: string;
  }): Promise<ApiResponse<Users>> {
    return baseService.makeUserRequest(
      API_CONFIG.USER_API.ENDPOINTS.createAccount,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      }
    );
  }

  async createUserApplication(applicationData: {
    userId: string;
    dateOfBirth: Date;
    gender: number;
    profilePicture: string;
    username: string;
  }): Promise<ApiResponse<UserApplication>> {
    return baseService.makeUserRequest(
      API_CONFIG.USER_API.ENDPOINTS.createUserApplication,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      }
    );
  }

  async getUserProgress(user_id: string): Promise<ApiResponse<Progress[]>> {
    return baseService.makeUserRequest(
      API_CONFIG.USER_API.ENDPOINTS.getUserProgress,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
      { user_id: user_id }
    );
  }

  async getUserProgressByResource(
    userUid: string,
    resource_uid: string
  ): Promise<ApiResponse<Progress | null>> {
    try {
      const endpoint = API_CONFIG.USER_API.ENDPOINTS.getResourceProgress;

      const response = await baseService.makeUserRequest<Progress[]>(
        endpoint,
        { method: "GET" },
        { user_id: userUid, resource_uid: resource_uid }
      );
      const progressItem =
        response.data && response.data.length > 0 ? response.data[0] : null;

      return { ...response, data: progressItem };
    } catch (error) {
      if (error) {
        return {
          data: null,
          status: 404,
          message: "No progress found for this resource.",
        };
      }
      console.error(
        `Failed to get progress for resource ${resource_uid}`,
        error
      );
      throw error;
    }
  }

  async createOrUpdateProgress(
    userUid: string,
    resourceUid: string,
    audioFile: File
  ): Promise<ApiResponse<Progress>> {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("userUid", userUid);
    formData.append("resourceUid", resourceUid);

    return baseService.makeAudioRequest(
      API_CONFIG.USER_API.ENDPOINTS.createOrUpdateEvaluation,
      formData
    );
  }
}

export const userService = UserService.getInstance();
