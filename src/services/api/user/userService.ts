import { baseService } from "../baseService";
import { API_CONFIG } from "@/config/api";
import {
  getProgressByUserUid,
  createOrUpdateEvaluation,
} from "@/data/mockups/userData";
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
    const mockNewUser: Users = {
      uid: `user_${Date.now()}`,
      email: accountData.email,
      name: accountData.name,
      password: "hashed_password",
      disabled: false,
    };

    return baseService.makeUserRequest(
      mockNewUser,
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
    const mockNewApplication: UserApplication = {
      uid: `application_${Date.now()}`,
      userId: applicationData.userId,
      lastLogin: new Date(),
      creationDate: new Date(),
      dateOfBirth: applicationData.dateOfBirth,
      gender: applicationData.gender,
      profilePicture: applicationData.profilePicture,
      username: applicationData.username,
    };

    return baseService.makeUserRequest(
      mockNewApplication,
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

  async getUserProgress(userUid: string): Promise<ApiResponse<Progress[]>> {
    const mockProgress = getProgressByUserUid(userUid);

    return baseService.makeUserRequest(
      mockProgress,
      API_CONFIG.USER_API.ENDPOINTS.getUserProgress,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
      { userUid }
    );
  }

  async createOrUpdateProgress(
    userUid: string,
    resourceUid: string,
    audioFile: File
  ): Promise<ApiResponse<Progress>> {
    const mockEvaluation = {
      audioUrl: `https://example.com/audio/${userUid}_${resourceUid}_${Date.now()}.mp3`,
      totalScore: Math.floor(Math.random() * 30) + 70,
      clarityScore: Math.floor(Math.random() * 30) + 70,
      speedScore: Math.floor(Math.random() * 30) + 70,
      rythmScore: Math.floor(Math.random() * 30) + 70,
      articulationScore: Math.floor(Math.random() * 30) + 70,
      clarityTip: "Bueno",
      speedTip: "Bueno",
      rythmTip: "Bueno",
      articulationTip: "Bueno",
    };

    const updatedProgress = createOrUpdateEvaluation(
      userUid,
      resourceUid,
      mockEvaluation
    );

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("userUid", userUid);
    formData.append("resourceUid", resourceUid);

    return baseService.makeAudioRequest(
      updatedProgress,
      API_CONFIG.USER_API.ENDPOINTS.createOrUpdateEvaluation,
      formData,
      {
        userUid,
        resourceUid,
      }
    );
  }
}

export const userService = UserService.getInstance();
