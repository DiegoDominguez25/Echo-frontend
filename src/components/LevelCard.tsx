import React, { useState } from "react";
import type { UserLevel } from "@/services/evaluationApi/AudioEvaluationService";
import { levelConfig } from "../constants/resourceConstants";
import { FiChevronDown } from "react-icons/fi";
interface UserLevelCardProps {
  label: UserLevel;
}

const UserLevelCard: React.FC<UserLevelCardProps> = ({ label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const config = levelConfig[label];

  return (
    <div
      className={`rounded-xl border p-6 shadow-sm ${config.bg} ${config.border} transition-all duration-300`}
    >
      <button
        onClick={toggleOpen}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${config.bg} ${config.color}`}
          >
            {config.icon}
          </div>
          <div className="flex items-center">
            <h3 className={`font-bold ${config.color}`}>
              {label
                ? `Your performance level is ${config.title}`
                : config.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <p>What does this mean?</p>
          <FiChevronDown
            className={`h-6 w-6 transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="mt-1 text-gray-600 text-left">{config.description}</p>
        </div>
      )}
    </div>
  );
};

export default UserLevelCard;
