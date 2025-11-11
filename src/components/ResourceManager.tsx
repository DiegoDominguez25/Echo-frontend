import React from "react";
import ResourceTable from "./ResourceTable";
import { useNavigate } from "react-router-dom";
import landing from "@/assets/images/landing.png";
import Pagination from "./Pagination";
import { useResourceManager } from "@/hooks/resourceHooks/useResourceManager";
import ResourceTypeSelector from "./ResourceTypeSelector";
import CategoryFilterGrid from "./CategoryFilterGrid";
import DifficultyFilterTabs from "./DifficultyFilterTabs";

interface ResourceManagerProps {
  user_id: string;
}

const ResourceManager: React.FC<ResourceManagerProps> = ({ user_id }) => {
  const navigate = useNavigate();

  const {
    resourceType,
    category,
    difficulty,
    currentPage,
    capitalizedResourceType,
    categoriesWithCount,
    difficultyCounts,
    paginatedResources,
    totalPages,
    loading,
    handleResourceTypeChange,
    handleCategoryChange,
    handleDifficultyChange,
    handlePageChange,
  } = useResourceManager({ user_id });

  const handleViewResource = async (resource_uid: string): Promise<void> => {
    try {
      navigate(`/app/resources/${resourceType}/${resource_uid}`);
    } catch (error) {
      console.error("Error loading resource:", error);
    }
  };

  return (
    <div className="px-5">
      <div className="lg:flex lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:w-auto w-full">
          <div className="text-xl font-bold text-[#8BA1E9] xl:text-2xl">
            <h1>HI USER.</h1>
            <p className="text-4xl mt-3 lg:text-5xl xl:text-8xl">
              Explore all of our resources.
            </p>
            <div className="mt-3 text-gray-500 font-semibold text-2xl flex flex-col gap-2 xl:text-3xl">
              <p>Choose something you like. Practice, practice, practice.</p>
              <p>Get feedback and improve.</p>
            </div>
          </div>

          <ResourceTypeSelector
            currentType={resourceType}
            onChange={handleResourceTypeChange}
          />
        </div>

        <div className="hidden lg:flex justify-center items-center">
          <img
            src={landing}
            className="h-80 w-auto object-contain xl:h-90"
            alt="Resources illustration"
          />
        </div>
      </div>

      <div className="flex flex-col items-center lg:items-start">
        <CategoryFilterGrid
          loading={loading}
          categories={categoriesWithCount}
          selectedCategory={category}
          onCategoryClick={handleCategoryChange}
          resourceType={resourceType}
          capitalizedResourceType={capitalizedResourceType}
        />
        <DifficultyFilterTabs
          counts={difficultyCounts}
          selectedDifficulty={difficulty}
          onChange={handleDifficultyChange}
          resourceType={resourceType}
        />
      </div>

      <ResourceTable
        resources={paginatedResources}
        resourceType={resourceType}
        onViewResource={handleViewResource}
        loading={loading}
        category={category}
      />
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ResourceManager;
