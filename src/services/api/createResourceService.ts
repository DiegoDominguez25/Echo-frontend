import { baseService } from "@/services/api/baseService";
import { API_CONFIG } from "@/config/api";
import type { Progress } from "@/data/interfaces/UserData";
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
    const progressForThisResource = userProgress?.find((p) => {
      return p.resource_uid === resource.id;
    });

    if (progressForThisResource) {
      return {
        id: resource.id,
        categories: resource.categories,
        difficulty: resource.difficulty,
        resource: resource,
        isCompleted: progressForThisResource.completed,
        attempts: progressForThisResource.attempts,
        evaluation: progressForThisResource.evaluation,
        progress: progressForThisResource,
      };
    }

    return {
      id: resource.id,
      categories: resource.categories,
      difficulty: resource.difficulty,
      resource: resource,
      isCompleted: false,
      attempts: 0,
      evaluation: null,
      progress: null,
    };
  };

  return {
    async getAll(): Promise<ArrayResponse<T>> {
      const response = await baseService.makeDataRequest<T[]>(endpoints.all);

      return response;
    },

    async getById(id: string): Promise<SingleResponse<T>> {
      const response = await baseService.makeDataRequest<T>(
        endpoints.byId,
        undefined,
        { id }
      );

      if (response.data && !("id" in response.data)) {
        response.data = {
          ...(response.data as object),
          id: id,
        } as T;
      }
      return response;
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

        const userProgressData = Array.isArray(progressResponse.data)
          ? progressResponse.data
          : [];

        const resourcesWithProgress = resourcesResponse.data.map((resource) =>
          resourceWithProgress(resource, userProgressData)
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
      resource_uid: string,
      userUid: string
    ): Promise<SingleResponse<ResourceWithProgress<T>>> {
      try {
        const [resourceResponse, progressResponse] = await Promise.all([
          this.getById(resource_uid),
          userService.getUserProgressByResource(userUid, resource_uid),
        ]);

        if (!resourceResponse.data) {
          return {
            data: null,
            status: 404,
            message: `Resource with ID '${resource_uid}' not found`,
          };
        }

        const resourceWithProgressData = resourceWithProgress(
          resourceResponse.data,
          progressResponse.data ? [progressResponse.data] : []
        );

        return {
          data: resourceWithProgressData,
          status: 200,
          message: `Resource with ID '${resource_uid}' and progress loaded successfully`,
        };
      } catch (error) {
        throw new Error(`Failed to load resource with progress: ${error}`);
      }
    },

    async getByDifficultyWithProgress(
      difficulty: string,
      userUid: string
    ): Promise<ArrayResponse<ResourceWithProgress<T>>> {
      try {
        const resourcesResponse = await this.getByDifficulty(difficulty);
        const progressResponse = await userService.getUserProgress(userUid);

        const userProgressData = Array.isArray(progressResponse.data)
          ? progressResponse.data
          : [];

        const resourcesWithProgress = resourcesResponse.data.map((resource) =>
          resourceWithProgress(resource, userProgressData)
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

        const userProgressData = Array.isArray(progressResponse.data)
          ? progressResponse.data
          : [];

        const resourceWithProgressData = resourceWithProgress(
          resourceResponse.data,
          userProgressData
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
