import { useState, useEffect, useMemo } from "react";
import {
  useSentences,
  useWords,
  useTexts,
} from "@/hooks/resourceHooks/useResourceHooks";
import type { ResourceWithProgress } from "@/services/api/createResourceService";
import type { ResourceType, ResourceData } from "@/data/types/resourceTypes";
import { capitalizeFirstLetter } from "@/utils/resourceUtils";
import { ITEMS_PER_PAGE } from "@/constants/resourceConstants";
import { useSearchParams } from "react-router-dom";

interface UseResourceManagerLogicProps {
  user_id: string | undefined;
}

export const useResourceManager = ({
  user_id,
}: UseResourceManagerLogicProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const resourceType = (searchParams.get("type") as ResourceType) || "words";
  const category = searchParams.get("category") || "all";
  const difficulty = searchParams.get("difficulty") || "0";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [allResourcesWithProgress, setAllResourcesWithProgress] = useState<
    ResourceWithProgress<ResourceData>[]
  >([]);

  const capitalizedResourceType = capitalizeFirstLetter(resourceType);

  const wordsHook = useWords();
  const sentencesHook = useSentences();
  const textsHook = useTexts();

  const currentHook = useMemo(() => {
    const hooks = {
      words: wordsHook,
      sentences: sentencesHook,
      texts: textsHook,
    };
    return hooks[resourceType];
  }, [resourceType, wordsHook, sentencesHook, textsHook]);

  useEffect(() => {
    const loadResourcesWithProgress = async () => {
      if (!user_id) return;

      try {
        const result = await currentHook.getAllWithProgress(user_id);
        setAllResourcesWithProgress(result || []);
      } catch (error) {
        console.error(`❌ Error loading ${resourceType} with progress:`, error);
        setAllResourcesWithProgress([]);
      }
    };

    loadResourcesWithProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceType, user_id, currentHook.getAllWithProgress]);

  const categoriesWithCount = useMemo(() => {
    const categoryMap = new Map<string, number>();
    allResourcesWithProgress.forEach((resource) => {
      if (!resource?.categories || !Array.isArray(resource.categories)) {
        return;
      }
      resource.categories.forEach((cat) => {
        if (cat && typeof cat === "string" && cat.trim()) {
          const trimmedCat = cat.trim();
          categoryMap.set(trimmedCat, (categoryMap.get(trimmedCat) || 0) + 1);
        }
      });
    });
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allResourcesWithProgress]);

  const difficultyCounts = useMemo(() => {
    const counts: Record<string, number> = { "0": 0, "1": 0, "2": 0 };
    allResourcesWithProgress.forEach((resource) => {
      const diffKey = String(resource.difficulty);
      if (counts[diffKey] !== undefined) {
        counts[diffKey]++;
      }
    });
    return counts;
  }, [allResourcesWithProgress]);

  const filteredResources = useMemo(() => {
    return allResourcesWithProgress.filter((resource) => {
      if (!resource?.categories) return false;
      const categoryMatch =
        category === "all" ||
        resource.categories.some(
          (cat: string) => cat.toLowerCase() === category.toLowerCase()
        );
      const difficultyMatch =
        difficulty === "all" || String(resource.difficulty) === difficulty;
      return categoryMatch && difficultyMatch;
    });
  }, [allResourcesWithProgress, category, difficulty]);

  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredResources.slice(startIndex, endIndex);
  }, [currentPage, filteredResources]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);

  const handleResourceTypeChange = (type: ResourceType) => {
    setSearchParams({
      type: type,
      category: "all",
      difficulty: "0",
      page: "1",
    });
  };

  const handleCategoryChange = (newCategory: string) => {
    const nextCategory = category === newCategory ? "all" : newCategory;
    setSearchParams((prev) => {
      prev.set("category", nextCategory);
      prev.set("page", "1");
      return prev;
    });
  };

  const handleDifficultyChange = (newDifficulty: string) => {
    const nextDifficulty = difficulty === newDifficulty ? "all" : newDifficulty;
    setSearchParams((prev) => {
      prev.set("difficulty", nextDifficulty);
      prev.set("page", "1");
      return prev;
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      prev.set("page", page.toString());
      return prev;
    });
  };

  return {
    resourceType,
    category,
    difficulty,
    currentPage,
    capitalizedResourceType,
    categoriesWithCount,
    difficultyCounts,
    paginatedResources,
    totalPages,
    loading: currentHook.loading,

    handleResourceTypeChange,
    handleCategoryChange,
    handleDifficultyChange,
    handlePageChange,
  };
};
