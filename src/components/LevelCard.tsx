import React, { useState } from "react";
import type { UserLevel } from "@/services/evaluationApi/AudioEvaluationService";
import { levelConfig } from "../constants/resourceConstants";
import { FiChevronDown } from "react-icons/fi";
interface UserLevelCardProps {
  label: UserLevel;
}

const UserLevelCard: React.FC<UserLevelCardProps> = ({ label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isTipsOpen, setIsTipsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleDescription = () => {
    setIsDescriptionOpen(!isDescriptionOpen);
  };

  const toggleTips = () => {
    setIsTipsOpen(!isTipsOpen);
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
          <button
            onClick={toggleDescription}
            className="flex w-full items-center gap-2 text-sm text-gray-500 mb-2"
          >
            <p className="font-medium">What does your performance look like?</p>
            <FiChevronDown
              className={`h-5 w-5 transform transition-transform duration-200 ${
                isDescriptionOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDescriptionOpen && (
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm text-left pl-2 mt-2">
              {config.description.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          )}
          <button
            onClick={toggleTips}
            className="flex w-full items-center gap-2 text-sm mt-5 text-gray-500 mb-2"
          >
            <p className="font-medium">How to improve?</p>
            <FiChevronDown
              className={`h-5 w-5 transform transition-transform duration-200 ${
                isTipsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isTipsOpen && (
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm text-left pl-2 mt-2">
              {config.tips.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default UserLevelCard;
