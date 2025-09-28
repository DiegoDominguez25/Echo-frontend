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
import landing from "@/assets/images/landing.png";
import daily_life from "@/assets/images/daily_life.png";
import education from "@/assets/images/education.png";
import health from "@/assets/images/health.png";
import work from "@/assets/images/work.png";
import travel from "@/assets/images/travel.png";
import social_life from "@/assets/images/social_life.png";
import { FaSpinner } from "react-icons/fa";
import Pagination from "./Pagination";

type ResourceType = "words" | "sentences" | "texts";
type ResourceData = Words | Sentences | Texts;

interface ResourceManagerProps {
  user_id: string;
}
const ITEMS_PER_PAGE = 10;

const ResourceManager: React.FC<ResourceManagerProps> = ({ user_id }) => {
  const [resourceType, setResourceType] = useState<ResourceType>("words");
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [allResourcesWithProgress, setAllResourcesWithProgress] = useState<
    ResourceWithProgress<ResourceData>[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);

  const resourceTypes = [
    { value: "words", label: "Words" },
    { value: "sentences", label: "Sentences" },
    { value: "texts", label: "Texts" },
  ];

  const difficultyLevels = [
    { value: "0", label: "Easy" },
    { value: "1", label: "Intermediate" },
    { value: "2", label: "Difficult" },
  ];

  const categoryImages: Record<string, string> = {
    "daily life": daily_life,
    education: education,
    health: health,
    work: work,
    travel: travel,
    "social life": social_life,
  };

  const backgroundColors: Record<string, string> = {
    "daily life": "bg-[#D8E3FF]",
    work: "bg-[#EDD5D5]",
    "social life": "bg-[#EFECAE]",
    education: "bg-[#D2F2E4]",
    travel: "bg-[#D8E3FF]",
    health: "bg-[#EDD5D5]",
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const capitalizedResourceType = capitalizeFirstLetter(resourceType);

  const handleResourceTypeClick = (type: ResourceType) => {
    setResourceType(type);
    setCurrentPage(1);
  };

  const navigate = useNavigate();

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
          }
        });
      });

      const result = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
      return result;
    } catch (error) {
      console.error("💥 Error calculating categories:", error);
      return [];
    }
  }, [allResourcesWithProgress]);

  const getDifficultyCounts = useMemo(() => {
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

  useEffect(() => {
    setCurrentPage(1);
  }, [category, difficulty]);

  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredResources.slice(startIndex, endIndex);
  }, [currentPage, filteredResources]);

  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);

  const handleViewResource = async (resource_uid: string): Promise<void> => {
    try {
      navigate(`/app/resources/${resourceType}/${resource_uid}`);
    } catch (error) {
      console.error("Error loading resource:", error);
    }
  };

  return (
    <div className="px-5">
      <div className="lg:flex lg:flex-row lg:justify-between lg:items-center">
        <div className="lg:w-2/3">
          <div className="text-xl font-bold text-[#8BA1E9]">
            <h1>HI USER.</h1>
            <p className="text-4xl mt-3 lg:text-5xl">
              Explore all of our resources.
            </p>
            <div className="mt-3 text-gray-500 font-semibold text-2xl flex flex-col gap-2 xl:text-xl">
              <p>Choose something you like. Practice, practice, practice.</p>
              <p>Get feedback and improve.</p>
            </div>
          </div>

          <div className="flex flex-row gap-10 mt-10">
            {resourceTypes.map((type) => (
              <button
                key={type.value}
                onClick={() =>
                  handleResourceTypeClick(type.value as ResourceType)
                }
                className={`relative pb-2 text-2xl font-bold transition-colors duration-200 ${
                  resourceType === type.value
                    ? "text-black text-2xl"
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
        </div>

        <div className="hidden lg:flex justify-center items-center max-w1/3">
          <img src={landing} className="h-80 w-auto object-contain" />
        </div>
      </div>

      <div className="flex flex-col items-center lg:items-start">
        <label className="text-xl font-semibold mt-2 text-center lg:text-left">
          <p>{capitalizedResourceType} By Situations</p>
          <p className="text-lg text-gray-700 font-normal mt-3 lg:text-base">
            Practice with {resourceType} used in specific situations of life.
            Click a category to see more.
          </p>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 my-6 w-full">
          {currentHook.loading ? (
            <div className="w-full flex justify-center items-center col-span-full">
              <FaSpinner className="animate-spin text-4xl text-gray-400" />
              <div className="text-gray-600 ml-2">Loading...</div>
            </div>
          ) : (
            getCurrentTypeCategoriesWithCount.map(({ name, count }) => (
              <button
                key={name}
                onClick={() =>
                  setCategory((prevCategory) =>
                    prevCategory === name ? "all" : name
                  )
                }
                className={`flex flex-col border border-gray-300 shadow-md shadow-black/30 items-start justify-between p-4 rounded-lg text-lg text-left font-medium transition-all duration-200 h-60 ${
                  category === name
                    ? "bg-[#8BA1E9] text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {categoryImages[name] && backgroundColors[name] && (
                  <div
                    className={`w-full flex justify-center items-center rounded-t-md flex-grow ${backgroundColors[name]}`}
                  >
                    <img
                      src={categoryImages[name]}
                      alt={name}
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                )}
                <div className="mt-2">
                  <div className="font-bold">{capitalizeFirstLetter(name)}</div>
                  <div
                    className={`text-xs font-normal mt-1 border rounded-lg py-1 px-2 inline-block ${
                      category === name
                        ? "bg-white/20 border-white/50 text-white"
                        : "bg-gray-100 border-gray-300 text-gray-600"
                    }`}
                  >
                    {count} {capitalizedResourceType}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="flex flex-col items-center lg:items-start mt-8 w-full">
          <label className="text-xl font-semibold text-center lg:text-left">
            <p>All words</p>
            <p className="text-lg text-gray-700 font-normal mt-3 lg:text-base">
              Browse all the {resourceType} whe have. Click one to start
              practicing.
            </p>
          </label>
          <div className="relative w-full border-b border-gray-300 mt-4 pb-4">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
              {difficultyLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() =>
                    setDifficulty((prevDifficulty) =>
                      prevDifficulty === level.value ? "all" : level.value
                    )
                  }
                  className={`relative py-2 px-1 font-semibold transition-colors duration-200 ${
                    difficulty === level.value
                      ? "text-[#8BA1E9]"
                      : "text-black hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center">
                    <span>{level.label}</span>

                    <span
                      className={` px-2 py-0.5 ${
                        difficulty === level.value
                          ? "text-[#8BA1E9]"
                          : "text-black hover:text-gray-800"
                      }`}
                    >
                      ({getDifficultyCounts[level.value] || 0})
                    </span>
                  </div>

                  <div
                    className={`absolute -bottom-4 left-0 h-0.5 bg-[#8BA1E9] transition-all duration-300 ${
                      difficulty === level.value ? "w-full" : "w-0"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ResourceTable
        resources={paginatedResources}
        resourceType={resourceType}
        onViewResource={handleViewResource}
        loading={currentHook.loading}
        category={category}
      />
      {!currentHook.loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default ResourceManager;
