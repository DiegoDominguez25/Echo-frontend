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
  user_id: string;
}

const ResourceManager: React.FC<ResourceManagerProps> = ({ user_id }) => {
  const [resourceType, setResourceType] = useState<ResourceType>("words");
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [allResourcesWithProgress, setAllResourcesWithProgress] = useState<
    ResourceWithProgress<ResourceData>[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);

  const resourceTypes = [
    { value: "words", label: "Words" },
    { value: "sentences", label: "Sentences" },
    { value: "texts", label: "Texts" },
  ];

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const capitalizedResourceType = capitalizeFirstLetter(resourceType);

  const handleResourceTypeClick = (type: ResourceType) => {
    setResourceType(type);
  };

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
    []
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

  useEffect(() => {
    const loadResourcesWithProgress = async () => {
      if (!user_id) return;

      try {
        setLoading(true);
        console.log(
          `🚀 Loading all ${resourceType} with progress for user: ${user_id}...`
        );

        const currentHook = resourceHooks[resourceType];
        const result = await currentHook.getAllWithProgress(user_id);

        console.log(
          `✅ Loaded ${result?.length || 0} ${resourceType} with progress`
        );
        console.log("📊 Sample resource:", result?.[0]);

        setAllResourcesWithProgress(result || []);
      } catch (error) {
        console.error(`❌ Error loading ${resourceType} with progress:`, error);
        setAllResourcesWithProgress([]);
      } finally {
        setLoading(false);
      }
    };

    loadResourcesWithProgress();
  }, [resourceType, user_id, resourceHooks]);

  const currentHook = resourceHooks[resourceType];

  const getCurrentTypeCategoriesWithCount = useMemo(() => {
    const categoryMap = new Map<string, number>();

    try {
      console.log(
        `🔄 Calculating categories from ${allResourcesWithProgress.length} resources...`
      );

      allResourcesWithProgress.forEach((resource, index) => {
        if (!resource) {
          console.warn(`⚠️ Resource ${index} is null/undefined`);
          return;
        }

        if (!resource.categories || !Array.isArray(resource.categories)) {
          console.warn(
            `⚠️ Resource ${index} has invalid categories:`,
            resource.categories
          );
          return;
        }

        resource.categories.forEach((cat) => {
          if (cat && typeof cat === "string" && cat.trim()) {
            const trimmedCat = cat.trim();
            categoryMap.set(trimmedCat, (categoryMap.get(trimmedCat) || 0) + 1);
            console.log(`📝 Added category: ${trimmedCat}`);
          }
        });
      });

      const result = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));

      console.log(`📊 Final categories:`, result);
      return result;
    } catch (error) {
      console.error("💥 Error calculating categories:", error);
      return [];
    }
  }, [allResourcesWithProgress]);

  const filteredResources = useMemo(() => {
    console.log(`🔍 Filtering ${allResourcesWithProgress.length} resources...`);
    console.log(`🔍 Filters: category=${category}, difficulty=${difficulty}`);

    const filtered = allResourcesWithProgress.filter((resource) => {
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

    console.log(`✅ Filtered to ${filtered.length} resources`);
    return filtered;
  }, [allResourcesWithProgress, category, difficulty]);

  const handleViewResource = async (resourceId: string): Promise<void> => {
    try {
      navigate(`/app/resources/${resourceType}/${resourceId}`);
    } catch (error) {
      console.error("Error loading resource:", error);
    }
  };

  const handleDifficultyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setDifficulty(e.target.value);
  };

  return (
    <div className="px-5">
      <div className="text-xl font-bold text-[#8BA1E9]">
        <h1>HI USER.</h1>
        <p className="text-4xl mt-3">Explore all of our</p>
        <p className="text-4xl mt-6"> resources.</p>
        <div className="mt-3 text-gray-500 font-semibold text-2xl flex flex-col gap-2">
          <p>Choose something you like.</p>
          <p>Practice, practice, practice.</p>
          <p>Get feedback and improve.</p>
        </div>
      </div>
      <div className="flex flex-row gap-10 justify-center mt-10">
        {resourceTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => handleResourceTypeClick(type.value as ResourceType)}
            className={`relative pb-2 text-2xl font-bold transition-colors duration-200 ${
              resourceType === type.value
                ? "text-black"
                : "text-gray-800/50 text-xl"
            }`}
          >
            {type.label}
            <div
              className={`absolute bottom-0 left-0 h-1 bg-black transition-all duration-400 ease-in-out ${
                resourceType === type.value
                  ? "w-1/2 opacity-100"
                  : "w-0 opacity-0"
              }`}
            />
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center">
        <label className="text-xl font-semibold mt-5 text-center">
          <p>{capitalizedResourceType} By Situations</p>
          <p className="text-lg text-gray-700 font-normal mt-3">
            Practice with words used in specific situations of life. Click a
            category to see more.
          </p>
        </label>
        <div className="flex w-full h-20 justify-start gap-4 my-6 overflow-x-scroll">
          <button
            onClick={() => setCategory("all")}
            className={`flex flex-col border border-gray-300 shadow-xl shadow-black/20 items-start justify-start min-w-[200px] max-h-[70px] py-2 px-4 rounded-lg text-lg font-medium transition-all duration-200 ${
              category === "all"
                ? "bg-[#8BA1E9] text-white"
                : "bg-gray-100 text-black-600 hover:bg-gray-200"
            }`}
          >
            <div>All</div>
            <div
              className={`flex justify-start text-xs font-normal text-gray-700 border border-gray-300 rounded-lg py-1 px-2 ${
                category === "all" ? "text-white" : ""
              }`}
            >
              {resourceHooks[resourceType].data.length}{" "}
              {capitalizedResourceType}
            </div>
          </button>

          {getCurrentTypeCategoriesWithCount.map(({ name, count }) => (
            <button
              key={name}
              onClick={() => setCategory(name)}
              className={`flex flex-col border border-gray-300 shadow-xl shadow-black/20 items-start justify-start min-w-[200px] max-h-[70px] py-2 px-4 rounded-lg text-lg text-left font-medium transition-all duration-200  ${
                category === name
                  ? "bg-[#8BA1E9] text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              <div>{capitalizeFirstLetter(name)}</div>
              <div
                className={`flex justify-start text-xs font-normal text-gray-700 border border-gray-300 rounded-lg py-1 px-2 ${
                  category === name ? "text-white" : ""
                }`}
              >
                {count} {capitalizedResourceType}
              </div>
            </button>
          ))}
        </div>
        {category === "all" && <div>All words</div>}

        <div>
          <select
            value={difficulty}
            onChange={handleDifficultyChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Easy</option>
            <option value={1}>Intermediate</option>
            <option value={2}>Difficult</option>
          </select>
        </div>
      </div>

      <ResourceTable
        resources={filteredResources}
        resourceType={resourceType}
        onViewResource={handleViewResource}
        loading={currentHook.loading}
      />
    </div>
  );
};

export default ResourceManager;
