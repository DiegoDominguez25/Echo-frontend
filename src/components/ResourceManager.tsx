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

  const getCurrentTypeCategoriesWithCount = useMemo(() => {
    const categoryMap = new Map<string, number>();

    resourceHooks[resourceType].data.forEach((resource: ResourceData) => {
      resource.categories.forEach((cat) => {
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
      });
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
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
