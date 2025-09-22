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
  id: string;
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
  resourceName: keyof typeof API_CONFIG.DATA_API.ENDPOINTS.resources
) {
  const endpoints = API_CONFIG.DATA_API.ENDPOINTS.resources[
    resourceName
  ] as ResourceEndpoints;

  const resourceWithProgress = (
    resource: T,
    userProgress?: Progress[]
  ): ResourceWithProgress<T> => {
    if (!userProgress) {
      console.log("❌ No user progress data, returning defaults");
      return {
        id: resource.id,
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

    const resourceProgress = userProgress.find((p) => p.id === resource.id);

    return {
      id: resource.id,
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
      return baseService.makeDataRequest(endpoints.all);
    },

    async getById(id: string): Promise<SingleResponse<T>> {
      return baseService.makeDataRequest(endpoints.byId, undefined, {
        id,
      });
    },

    async getByCategory(category: string): Promise<ArrayResponse<T>> {
      return baseService.makeDataRequest(endpoints.byCategory, undefined, {
        category,
      });
    },

    async getByDifficulty(difficulty: string): Promise<ArrayResponse<T>> {
      return baseService.makeDataRequest(endpoints.byDifficulty, undefined, {
        difficulty,
      });
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
        const allResourcesWithProgress = await this.getAllWithProgress(userUid);

        const filtered = allResourcesWithProgress.data.filter((resource) => {
          console.log("🔍 Filtering resource:", {
            id: resource.id,
            categories: resource.categories,
            hasCategories: !!resource.categories,
            isArray: Array.isArray(resource.categories),
          });

          return (
            resource.categories &&
            Array.isArray(resource.categories) &&
            resource.categories.some((cat: string) =>
              cat.toLowerCase().includes(category.toLowerCase())
            )
          );
        });
        return {
          data: filtered,
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
