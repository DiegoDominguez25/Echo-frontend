import React, { useRef } from "react";
import ResourceTable from "./ResourceTable";
import { useNavigate } from "react-router-dom";
import landing from "@/assets/images/landing.png";
import Pagination from "./Pagination";
import { useResourceManager } from "@/hooks/resourceHooks/useResourceManager";
import ResourceTypeSelector from "./ResourceTypeSelector";
import CategoryFilterGrid from "./CategoryFilterGrid";
import DifficultyFilterTabs from "./DifficultyFilterTabs";
import { useAuth } from "@/hooks/useAuth";

const ResourceManager: React.FC = () => {
  const navigate = useNavigate();
  const tableRef = useRef<HTMLDivElement>(null);

  const { user, profile } = useAuth();

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
  } = useResourceManager({ user_id: user?.id });

  const handleViewResource = async (resource_uid: string): Promise<void> => {
    try {
      navigate(`/app/resources/${resourceType}/${resource_uid}`);
    } catch (error) {
      console.error("Error loading resource:", error);
    }
  };

  const onCategoryClickWithScroll = (categoryName: string) => {
    handleCategoryChange(categoryName);

    tableRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="px-10 min-h-screen bg-white">
      <div className="grid grid-cols-3">
        <div className="lg:w-auto w-full col-span-3 md:col-span-2">
          <div className="text-xl font-bold text-[#8BA1E9]">
            <p className="uppercase pb-3">HI {profile?.username || user?.name || "USER"}.</p>
            <p className="text-4xl mt-4 lg:text-5xl">
              Explore all of our resources.
            </p>
            <div className="mt-6 text-gray-500 font-normal text-md md:text-2xl flex flex-col gap-2">
              <p>Choose something you like. Practice, practice, practice.</p>
              <p>Get feedback and improve.</p>
            </div>
          </div>

          <ResourceTypeSelector
            currentType={resourceType}
            onChange={handleResourceTypeChange}
          />
        </div>

        <div className="hidden md:block col-span-1">
          <img
            src={landing}
            className="h-80 w-auto object-contain"
            alt="Resources illustration"
          />
        </div>
      </div>

      <div className="flex flex-col items-center lg:items-start">
        <CategoryFilterGrid
          loading={loading}
          categories={categoriesWithCount}
          selectedCategory={category}
          onCategoryClick={onCategoryClickWithScroll}
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

      <div ref={tableRef}>
        <ResourceTable
          resources={paginatedResources}
          resourceType={resourceType}
          onViewResource={handleViewResource}
          loading={loading}
          category={category}
        />
      </div>
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
