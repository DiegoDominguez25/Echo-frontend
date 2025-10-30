import React from "react";
import { difficultyLevels } from "@/constants/resourceConstants";

interface DifficultyFilterTabsProps {
  counts: Record<string, number>;
  selectedDifficulty: string;
  onChange: (difficultyValue: string) => void;
  resourceType: string;
}

const DifficultyFilterTabs: React.FC<DifficultyFilterTabsProps> = ({
  counts,
  selectedDifficulty,
  onChange,
  resourceType,
}) => (
  <div className="flex flex-col items-center lg:items-start mt-8 w-full">
    <label className="text-xl font-semibold text-center lg:text-left">
      <p>All {resourceType}</p>
      <p className="text-lg text-gray-700 font-normal mt-3 lg:text-base">
        Browse all the {resourceType} we have. Click one to start practicing.
      </p>
    </label>
    <div className="relative w-full border-b border-gray-300 mt-4 pb-4">
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
        {difficultyLevels.map((level) => (
          <button
            key={level.value}
            onClick={() => onChange(level.value)}
            className={`relative py-2 px-1 font-semibold transition-colors duration-200 ${
              selectedDifficulty === level.value
                ? "text-[#8BA1E9]"
                : "text-black hover:text-gray-800"
            }`}
          >
            <div className="flex items-center">
              <span>{level.label}</span>
              <span
                className={` px-2 py-0.5 ${
                  selectedDifficulty === level.value
                    ? "text-[#8BA1E9]"
                    : "text-black hover:text-gray-800"
                }`}
              >
                ({counts[level.value] || 0})
              </span>
            </div>
            <div
              className={`absolute -bottom-4 left-0 h-0.5 bg-[#8BA1E9] transition-all duration-300 ${
                selectedDifficulty === level.value ? "w-full" : "w-0"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default DifficultyFilterTabs;
