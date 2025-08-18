import { baseService } from "@/services/api/baseService";
import { API_CONFIG } from "@/config/api";
import type { Progress } from "@/data/types/UserData";
import { userService } from "./user/userService";

type ResourceEndpoints = {
  all: string;
  byId: string;
  byCategory: string;
  byDifficulty: string;
};

interface HasProps {
  uid: string;
  categories: string[];
  difficulty: string;
}

export interface ResourceWithProgress<T> extends HasProps {
  resource: T;
  isCompleted: boolean;
  attempts: number;
  lastAttempt: Date | null;
  evaluation: Progress["evaluation"] | null;
  progress: Progress | null;
}

type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

type SingleResponse<T> = ApiResponse<T | null>;
type ArrayResponse<T> = ApiResponse<T[]>;

export function createResourceService<T extends HasProps>(
  resourceName: keyof typeof API_CONFIG.DATA_API.ENDPOINTS.resources,
  mockData: T[]
) {
  const endpoints = API_CONFIG.DATA_API.ENDPOINTS.resources[
    resourceName
  ] as ResourceEndpoints;

  const resourceWithProgress = (
    resource: T,
    userProgress?: Progress[]
  ): ResourceWithProgress<T> => {
    if (!userProgress) {
      return {
        uid: resource.uid,
        categories: resource.categories,
        difficulty: resource.difficulty,
        resource,
        isCompleted: false,
        attempts: 0,
        lastAttempt: null,
        evaluation: null,
        progress: null,
      };
    }

    const resourceProgress = userProgress.find(
      (p) => p.resourceUid === resource.uid
    );

    return {
      uid: resource.uid,
      categories: resource.categories,
      difficulty: resource.difficulty,
      resource,
      isCompleted: resourceProgress?.completed ?? false,
      attempts: resourceProgress?.attempts ?? 0,
      lastAttempt: resourceProgress?.lastAttempt ?? null,
      evaluation: resourceProgress?.evaluation ?? null,
      progress: resourceProgress ?? null,
    };
  };

  return {
    async getAll(): Promise<ArrayResponse<T>> {
      return baseService.makeDataRequest(mockData, endpoints.all);
    },

    async getById(id: string): Promise<SingleResponse<T>> {
      const mockItem = mockData.find((item) => item.uid === id) || null;
      return baseService.makeDataRequest(mockItem, endpoints.byId, undefined, {
        id,
      });
    },

    async getByCategory(category: string): Promise<ArrayResponse<T>> {
      const mockFiltered = mockData.filter((item) =>
        item.categories?.some((cat) =>
          cat.toLowerCase().includes(category.toLowerCase())
        )
      );
      return baseService.makeDataRequest(
        mockFiltered,
        endpoints.byCategory,
        undefined,
        { category }
      );
    },

    async getByDifficulty(difficulty: string): Promise<ArrayResponse<T>> {
      const mockFiltered = mockData.filter(
        (item) => item.difficulty === difficulty
      );
      return baseService.makeDataRequest(
        mockFiltered,
        endpoints.byDifficulty,
        undefined,
        {
          difficulty,
        }
      );
    },

    async getAllWithProgress(
      userUid: string
    ): Promise<ArrayResponse<ResourceWithProgress<T>>> {
      try {
        const resourcesResponse = await this.getAll();
        const progressResponse = await userService.getUserProgress(userUid);

        const resourcesWithProgress = resourcesResponse.data.map((resource) =>
          resourceWithProgress(resource, progressResponse.data)
        );

        return {
          data: resourcesWithProgress,
          status: 200,
          message: "Resources with progress loaded successfully",
        };
      } catch (error) {
        throw new Error(`Failed to load resources with progress: ${error}`);
      }
    },

    async getByCategoryWithProgress(
      category: string,
      userUid: string
    ): Promise<ArrayResponse<ResourceWithProgress<T>>> {
      try {
        const resourcesResponse = await this.getByCategory(category);
        const progressResponse = await userService.getUserProgress(userUid);

        const resourcesWithProgress = resourcesResponse.data.map((resource) =>
          resourceWithProgress(resource, progressResponse.data)
        );

        return {
          data: resourcesWithProgress,
          status: 200,
          message: "Resources by category with progress loaded successfully",
        };
      } catch (error) {
        throw new Error(`Failed to load resources with progress: ${error}`);
      }
    },

    async getByDifficultyWithProgress(
      difficulty: string,
      userUid: string
    ): Promise<ArrayResponse<ResourceWithProgress<T>>> {
      try {
        const resourcesResponse = await this.getByDifficulty(difficulty);
        const progressResponse = await userService.getUserProgress(userUid);

        const resourcesWithProgress = resourcesResponse.data.map((resource) =>
          resourceWithProgress(resource, progressResponse.data)
        );

        return {
          data: resourcesWithProgress,
          status: 200,
          message: `Resources with difficulty '${difficulty}' and progress loaded successfully`,
        };
      } catch (error) {
        throw new Error(
          `Failed to load difficulty resources with progress: ${error}`
        );
      }
    },

    async getByIdWithProgress(
      id: string,
      userUid: string
    ): Promise<SingleResponse<ResourceWithProgress<T>>> {
      try {
        const resourceResponse = await this.getById(id);

        if (!resourceResponse.data) {
          return {
            data: null,
            status: 404,
            message: `Resource with ID '${id}' not found`,
          };
        }

        const progressResponse = await userService.getUserProgress(userUid);

        const resourceWithProgressData = resourceWithProgress(
          resourceResponse.data,
          progressResponse.data
        );

        return {
          data: resourceWithProgressData,
          status: 200,
          message: `Resource with ID '${id}' and progress loaded successfully`,
        };
      } catch (error) {
        throw new Error(`Failed to load resource with progress: ${error}`);
      }
    },
  };
}
