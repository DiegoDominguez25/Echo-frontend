import React, { useState, useEffect, useMemo } from "react";
import {
  useSentences,
  useWords,
  useTexts,
} from "@/hooks/usersApi/useResourceHooks";
import ResourceTable from "./ResourceTable";
import type { ResourceWithProgress } from "@/services/api/createResourceService";
import type { Sentences, Words, Texts } from "@/data/types/ResourcesData";
import { useNavigate } from "react-router-dom";

type ResourceType = "words" | "sentences" | "texts";
type ResourceData = Words | Sentences | Texts;

interface ResourceManagerProps {
  userUid: string;
}

const ResourceManager: React.FC<ResourceManagerProps> = ({ userUid }) => {
  const [resourceType, setResourceType] = useState<ResourceType>("words");
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [resources, setResources] = useState<
    ResourceWithProgress<ResourceData>[]
  >([]);
  const navigate = useNavigate();

  const hookWords = useWords();
  const hookSentences = useSentences();
  const hookTexts = useTexts();

  const resourceHooks = useMemo(
    () => ({
      words: hookWords,
      sentences: hookSentences,
      texts: hookTexts,
    }),
    [hookWords, hookSentences, hookTexts]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          resourceHooks.words.getAll(),
          resourceHooks.sentences.getAll(),
          resourceHooks.texts.getAll(),
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, []);

  const getCurrentTypeCategories = useMemo((): string[] => {
    const categoriesSet = new Set<string>();

    resourceHooks[resourceType].data.forEach((resource: ResourceData) => {
      resource.categories.forEach((cat) => categoriesSet.add(cat));
    });

    return Array.from(categoriesSet).sort();
  }, [resourceHooks, resourceType]);

  const currentHook = resourceHooks[resourceType];

  useEffect(() => {
    const loadFilteredResources = async (): Promise<void> => {
      try {
        let result: ResourceWithProgress<ResourceData>[] = [];

        if (category === "all" && difficulty === "all") {
          result = await currentHook.getAllWithProgress(userUid);
        } else if (category !== "all" && difficulty === "all") {
          result = await currentHook.getByCategoryWithProgress(
            category,
            userUid
          );
        } else if (category === "all" && difficulty !== "all") {
          result = await currentHook.getByDifficultyWithProgress(
            difficulty,
            userUid
          );
        } else {
          const allResources = await currentHook.getAllWithProgress(userUid);
          result = allResources.filter(
            (resource: ResourceWithProgress<ResourceData>) =>
              resource.categories.some((cat: string) =>
                cat.toLowerCase().includes(category.toLowerCase())
              ) && resource.difficulty === difficulty
          );
        }

        setResources(result);
      } catch (error) {
        console.error("Error loading resources:", error);
      }
    };

    loadFilteredResources();
  }, [resourceType, category, difficulty, userUid]);

  const handleViewResource = async (resourceId: string): Promise<void> => {
    try {
      navigate(`/app/resources/${resourceType}/${resourceId}`);
    } catch (error) {
      console.error("Error loading resource:", error);
    }
  };

  const handleResourceTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setResourceType(e.target.value as ResourceType);
  };

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setCategory(e.target.value);
  };

  const handleDifficultyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setDifficulty(e.target.value);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2"></label>
          <select
            value={resourceType}
            onChange={handleResourceTypeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="words">Words</option>
            <option value="sentences">Sentences</option>
            <option value="texts">Texts</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <h1>{resourceType} by situation</h1>
            <span className="text-xs text-gray-400 ml-1"></span>
          </label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            {getCurrentTypeCategories.map((categoryName) => {
              const count = resourceHooks[resourceType].data.filter(
                (resource) => resource.categories.includes(categoryName)
              ).length;

              return (
                <option key={categoryName} value={categoryName}>
                  {categoryName} ({count})
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <select
            value={difficulty}
            onChange={handleDifficultyChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">Easy</option>
            <option value="2">Intermediate</option>
            <option value="3">Difficult</option>
          </select>
        </div>
      </div>

      <ResourceTable
        resources={resources}
        resourceType={resourceType}
        onViewResource={handleViewResource}
        loading={currentHook.loading}
      />
    </div>
  );
};

export default ResourceManager;
