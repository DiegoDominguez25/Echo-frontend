import { useState, useCallback, useMemo } from "react";
import { createResourceService } from "@/services/api/createResourceService";
import { API_CONFIG } from "@/config/api";
import type { Progress } from "@/data/interfaces/UserData";

interface HasProps {
  id: string;
  categories: string[];
  difficulty: string;
}

interface ResourceWithProgress<T> extends HasProps {
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

type ArrayResponse<T> = ApiResponse<T[]>;

export function useGenericResource<T extends HasProps>(
  resourceName: keyof typeof API_CONFIG.DATA_API.ENDPOINTS.resources
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(
    () => createResourceService<T>(resourceName),
    [resourceName]
  );

  const handleAsync = useCallback(
    async <R>(asyncFn: () => Promise<R>): Promise<R> => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFn();

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getAll = useCallback(async (): Promise<T[]> => {
    return handleAsync(() => service.getAll()).then(
      (response) => response.data
    );
  }, [service, handleAsync]);

  const getById = useCallback(
    async (id: string): Promise<T | null> => {
      return handleAsync(() => service.getById(id)).then(
        (response) => response.data
      );
    },
    [service, handleAsync]
  );

  const getByCategory = useCallback(
    async (category: string): Promise<T[]> => {
      return handleAsync(() => service.getByCategory(category)).then(
        (response) => response.data
      );
    },
    [service, handleAsync]
  );

  const getByDifficulty = useCallback(
    async (difficulty: string): Promise<T[]> => {
      return handleAsync(() => service.getByDifficulty(difficulty)).then(
        (response) => response.data
      );
    },
    [service, handleAsync]
  );

  const getAllWithProgress = useCallback(
    async (userUid: string): Promise<ResourceWithProgress<T>[]> => {
      return handleAsync(() => service.getAllWithProgress(userUid)).then(
        (response) => response.data
      );
    },
    [service, handleAsync]
  );

  const getByIdWithProgress = useCallback(
    async (
      id: string,
      userUid: string
    ): Promise<ResourceWithProgress<T> | null> => {
      return handleAsync(() => service.getByIdWithProgress(id, userUid)).then(
        (response) => response.data
      );
    },
    [service, handleAsync]
  );

  const getByCategoryWithProgress = useCallback(
    async (
      category: string,
      userUid: string
    ): Promise<ResourceWithProgress<T>[]> => {
      const fetchAndAdapt = async (): Promise<
        ArrayResponse<ResourceWithProgress<T>>
      > => {
        const singleResponse = await service.getByCategoryWithProgress(
          category,
          userUid
        );

        if (singleResponse.data) {
          return { ...singleResponse, data: [singleResponse.data] };
        } else {
          return { ...singleResponse, data: [] };
        }
      };

      return handleAsync(fetchAndAdapt).then((response) => response.data);
    },
    [service, handleAsync]
  );

  const getByDifficultyWithProgress = useCallback(
    async (
      difficulty: string,
      userUid: string
    ): Promise<ResourceWithProgress<T>[]> => {
      return handleAsync(() =>
        service.getByDifficultyWithProgress(difficulty, userUid)
      ).then((response) => response.data);
    },
    [service, handleAsync]
  );

  const refresh = useCallback(async (): Promise<T[]> => {
    return getAll();
  }, [getAll]);

  return useMemo(
    () => ({
      loading,
      error,
      getAll,
      getById,
      getByCategory,
      getByDifficulty,
      getAllWithProgress,
      getByIdWithProgress,
      getByCategoryWithProgress,
      getByDifficultyWithProgress,
      refresh,
    }),
    [
      loading,
      error,
      getAll,
      getById,
      getByCategory,
      getByDifficulty,
      getAllWithProgress,
      getByIdWithProgress,
      getByCategoryWithProgress,
      getByDifficultyWithProgress,
      refresh,
    ]
  );
}
