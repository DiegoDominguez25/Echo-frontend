import React from "react";
import { FiBarChart, FiTrendingUp, FiAward } from "react-icons/fi";

import type { UserLevel } from "@/services/evaluationApi/AudioEvaluationService";

interface UserLevelCardProps {
  label: UserLevel;
}

const levelConfig = {
  Beginner: {
    title: "Beginner",
    description: "You're building a great foundation. Keep practicing!",
    icon: <FiBarChart className="h-6 w-6" />,
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-300",
  },
  Intermediate: {
    title: "Intermediate",
    description: "You're showing solid skills. Challenge yourself to improve!",
    icon: <FiTrendingUp className="h-6 w-6" />,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
  },
  Advanced: {
    title: "Advanced",
    description: "Excellent work! You have a strong command of the language.",
    icon: <FiAward className="h-6 w-6" />,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-300",
  },
};

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
