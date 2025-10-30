import React from "react";
import { FaSpinner } from "react-icons/fa";
import {
  categoryImages,
  backgroundColors,
} from "@/constants/resourceConstants";
import { capitalizeFirstLetter } from "@/utils/resourceUtils";

interface Category {
  name: string;
  count: number;
}

interface CategoryFilterGridProps {
  loading: boolean;
  categories: Category[];
  selectedCategory: string;
  onCategoryClick: (categoryName: string) => void;
  resourceType: string;
  capitalizedResourceType: string;
}

const CategoryFilterGrid: React.FC<CategoryFilterGridProps> = ({
  loading,
  categories,
  selectedCategory,
  onCategoryClick,
  resourceType,
  capitalizedResourceType,
}) => (
  <div>
    <label className="text-xl font-semibold mt-2 text-center lg:text-left">
      <p>{capitalizedResourceType} By Situations</p>
      <p className="text-lg text-gray-700 font-normal mt-3 lg:text-base">
        Practice with {resourceType} used in specific situations of life. Click
        a category to see more.
      </p>
    </label>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 my-6 w-full">
      {loading ? (
        <div className="w-full flex justify-center items-center col-span-full">
          <FaSpinner className="animate-spin text-4xl text-gray-400" />
          <div className="text-gray-600 ml-2">Loading...</div>
        </div>
      ) : (
        categories.map(({ name, count }) => (
          <button
            key={name}
            onClick={() => onCategoryClick(name)}
            className={`flex flex-col border border-gray-300 shadow-md shadow-black/30 items-start justify-between p-4 rounded-lg text-lg text-left font-medium transition-all duration-200 h-60 ${
              selectedCategory === name
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
                  selectedCategory === name
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
  </div>
);

export default CategoryFilterGrid;
