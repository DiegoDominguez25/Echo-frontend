import React from "react";
import { resourceTypes } from "@/constants/resourceConstants";
import type { ResourceType } from "@/data/types/resourceTypes";

interface ResourceTypeSelectorProps {
  currentType: ResourceType;
  onChange: (type: ResourceType) => void;
}

const ResourceTypeSelector: React.FC<ResourceTypeSelectorProps> = ({
  currentType,
  onChange,
}) => (
  <div className="flex flex-row gap-10 mt-10">
    {resourceTypes.map((type) => (
      <button
        key={type.value}
        onClick={() => onChange(type.value as ResourceType)}
        className={`relative pb-2 text-2xl font-bold transition-colors duration-200 ${
          currentType === type.value
            ? "text-black text-2xl"
            : "text-gray-800/50 text-xl"
        }`}
      >
        {type.label}
        <div
          className={`absolute bottom-0 left-0 h-1 bg-black transition-all duration-400 ease-in-out ${
            currentType === type.value ? "w-1/2 opacity-100" : "w-0 opacity-0"
          }`}
        />
      </button>
    ))}
  </div>
);

export default ResourceTypeSelector;
