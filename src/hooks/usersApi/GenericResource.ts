import { useState, useCallback } from "react";
import { createResourceService } from "@/services/api/createResourceService";
import { API_CONFIG } from "@/config/api";
import type { Progress } from "@/data/types/UserData";

interface HasProps {
  uid: string;
  categories: string[];
  difficulty: string;
}

interface ResourceWithProgress<T> extends HasProps {
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

export function useGenericResource<T extends HasProps>(
  resourceName: keyof typeof API_CONFIG.DATA_API.ENDPOINTS.resources,
  mockData: T[]
) {
  const [data, setData] = useState<T[]>([]);
  const [dataWithProgress, setDataWithProgress] = useState<
    ResourceWithProgress<T>[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [singleItem, setSingleItem] = useState<T | null>(null);
  const [singleResourceWithProgress, setSingleResourceWithProgress] =
    useState<ResourceWithProgress<T> | null>(null);

  const service = createResourceService<T>(resourceName, mockData);

  const handleAsync = useCallback(
    async <R>(
      asyncFn: () => Promise<R>,
      onSuccess: (result: R) => void
    ): Promise<R> => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFn();
        onSuccess?.(result);
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
    return handleAsync(
      () => service.getAll(),
      (response: ArrayResponse<T>) => setData(response.data)
    ).then((response) => response.data);
  }, [service, handleAsync]);

  const getById = useCallback(
    async (id: string): Promise<T | null> => {
      return handleAsync(
        () => service.getById(id),
        (response: SingleResponse<T>) => setSingleItem(response.data)
      ).then((response) => response.data);
    },
    [service, handleAsync]
  );

  const getByCategory = useCallback(
    async (category: string): Promise<T[]> => {
      return handleAsync(
        () => service.getByCategory(category),
        (response: ArrayResponse<T>) => setData(response.data)
      ).then((response) => response.data);
    },
    [service, handleAsync]
  );

  const getByDifficulty = useCallback(
    async (difficulty: string): Promise<T[]> => {
      return handleAsync(
        () => service.getByDifficulty(difficulty),
        (response: ArrayResponse<T>) => setData(response.data)
      ).then((response) => response.data);
    },
    [service, handleAsync]
  );

  const getAllWithProgress = useCallback(
    async (userUid: string): Promise<ResourceWithProgress<T>[]> => {
      return handleAsync(
        () => service.getAllWithProgress(userUid),
        (response: ArrayResponse<ResourceWithProgress<T>>) =>
          setDataWithProgress(response.data)
      ).then((response) => response.data);
    },
    [service, handleAsync]
  );

  const getByIdWithProgress = useCallback(
    async (
      id: string,
      userUid: string
    ): Promise<ResourceWithProgress<T> | null> => {
      return handleAsync(
        () => service.getByIdWithProgress(id, userUid),
        (response: SingleResponse<ResourceWithProgress<T>>) =>
          setSingleResourceWithProgress(response.data)
      ).then((response) => response.data);
    },
    [service, handleAsync]
  );

  const getByCategoryWithProgress = useCallback(
    async (
      category: string,
      userUid: string
    ): Promise<ResourceWithProgress<T>[]> => {
      return handleAsync(
        () => service.getByCategoryWithProgress(category, userUid),
        (response: ArrayResponse<ResourceWithProgress<T>>) =>
          setDataWithProgress(response.data)
      ).then((response) => response.data);
    },
    [service, handleAsync]
  );

  const getByDifficultyWithProgress = useCallback(
    async (
      difficulty: string,
      userUid: string
    ): Promise<ResourceWithProgress<T>[]> => {
      return handleAsync(
        () => service.getByDifficultyWithProgress(difficulty, userUid),
        (response: ArrayResponse<ResourceWithProgress<T>>) =>
          setDataWithProgress(response.data)
      ).then((response) => response.data);
    },
    [service, handleAsync]
  );

  const refresh = useCallback(async (): Promise<T[]> => {
    return getAll();
  }, [getAll]);

  return {
    data,
    singleItem,
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
  };
}
