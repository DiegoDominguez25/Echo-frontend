import React from "react";
import type { UserLevel } from "@/services/evaluationApi/AudioEvaluationService";
import { levelConfig } from "../constants/resourceConstants";

interface UserLevelCardProps {
  label: UserLevel;
}

const UserLevelCard: React.FC<UserLevelCardProps> = ({ label }) => {
  const config = levelConfig[label];

  return (
    <div
      className={`rounded-xl border p-6 shadow-sm ${config.bg} ${config.border}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${config.bg} ${config.color}`}
        >
          {config.icon}
        </div>
        <div>
          <h3 className={`text-xl font-bold ${config.color}`}>
            Your Estimated Level is {config.title}
          </h3>
          <p className="mt-1 text-gray-600">{config.description}</p>
        </div>
      </div>
    </div>
  );
};

export default UserLevelCard;
