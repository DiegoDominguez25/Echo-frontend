import { useState, useEffect, useMemo } from "react";
import {
  useSentences,
  useWords,
  useTexts,
} from "@/hooks/usersApi/useResourceHooks";
import type { ResourceWithProgress } from "@/services/api/createResourceService";
import type { ResourceType, ResourceData } from "@/data/types/resourceTypes";
import { capitalizeFirstLetter } from "@/utils/resourceUtils";
import { ITEMS_PER_PAGE } from "@/constants/resourceConstants";

interface UseResourceManagerLogicProps {
  user_id: string;
}

export const useResourceManager = ({
  user_id,
}: UseResourceManagerLogicProps) => {
  const [resourceType, setResourceType] = useState<ResourceType>("words");
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [allResourcesWithProgress, setAllResourcesWithProgress] = useState<
    ResourceWithProgress<ResourceData>[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);

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
        setCurrentPage(1);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [category, difficulty]);

  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredResources.slice(startIndex, endIndex);
  }, [currentPage, filteredResources]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);

  const handleResourceTypeChange = (type: ResourceType) => {
    setResourceType(type);
    setCurrentPage(1);
    setCategory("all");
    setDifficulty("all");
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory((prev) => (prev === newCategory ? "all" : newCategory));
  };

  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty((prev) => (prev === newDifficulty ? "all" : newDifficulty));
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
    handlePageChange: setCurrentPage,
  };
};
