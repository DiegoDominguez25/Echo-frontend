import React from "react";
import type { ResourceWithProgress } from "@/services/api/createResourceService";
import type { Sentences, Words, Texts } from "@/data/types/ResourcesData";

type ResourceType = "words" | "sentences" | "texts";
type ResourceData = Words | Sentences | Texts;

interface ResourceTableProps {
  resources: ResourceWithProgress<ResourceData>[];
  resourceType: ResourceType;
  onViewResource: (resourceId: string) => void;
  loading?: boolean;
}

const ResourceTable: React.FC<ResourceTableProps> = ({
  resources,
  resourceType,
  onViewResource,
  loading = false,
}) => {
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getDescription = (
    resource: ResourceWithProgress<ResourceData>
  ): string => {
    const r = resource.resource;
    switch (resourceType) {
      case "words":
        return (r as Words).text;
      case "sentences":
        return (r as Sentences).text.slice(0, 1);
      case "texts":
        return (r as Texts).text;
      default:
        return "Not description";
    }
  };

  const getDuration = (
    resource: ResourceWithProgress<ResourceData>
  ): string => {
    const durations = {
      words: { easy: "30s", medium: "45s", hard: "60s" },
      sentences: { easy: "60s", medium: "90s", hard: "120s" },
      texts: { easy: "3min", medium: "5min", hard: "7min" },
    };
    return (
      durations[resourceType]?.[
        resource.difficulty as keyof typeof durations.words
      ] || "60s"
    );
  };

  const getWordCount = (
    resource: ResourceWithProgress<ResourceData>
  ): number => {
    const r = resource.resource;
    switch (resourceType) {
      case "words":
        return 1;
      case "sentences":
        return (r as Sentences).text.split(" ").length;
      case "texts":
        return (r as Texts).text.split(" ").length;
      default:
        return 0;
    }
  };

  const getStatusColor = (
    resource: ResourceWithProgress<ResourceData>
  ): string => {
    if (resource.isCompleted) return "text-green-600";
    if (resource.attempts > 0) return "text-yellow-600";
    return "text-gray-600";
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2">Loading animation</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Completed
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Situation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Words
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <tr
                key={resource.uid}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Completed */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {resource.isCompleted ? (
                    <span className="circle font-semibold">
                      Random color (yes)
                    </span>
                  ) : (
                    <span className="circle">Without color (no)</span>
                  )}
                </td>

                {/* Description */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-medium">
                    {getDescription(resource)}
                  </div>
                </td>

                {/* Situation */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-medium ${getStatusColor(
                      resource
                    )}`}
                  >
                    {capitalizeFirstLetter(resource.categories[0])}
                  </span>
                  {resource.attempts > 0 && (
                    <div className="text-xs text-gray-400">
                      attempt: {resource.attempts}
                      {resource.attempts !== 1 ? "s" : ""}
                    </div>
                  )}
                </td>

                {/* Duration */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getDuration(resource)}
                </td>

                {/* Words */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getWordCount(resource)}
                </td>

                {/* Action */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onViewResource(resource.uid)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    See more
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                <div className="text-gray-400">
                  <p>Not resources found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Quick Stats */}
      {resources.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Total: {resources.length}</span>
          <span>
            Completed: {resources.filter((r) => r.isCompleted).length}
          </span>
          <span>
            In Progress:{" "}
            {resources.filter((r) => !r.isCompleted && r.attempts > 0).length}
          </span>
          <span>
            Pending: {resources.filter((r) => r.attempts === 0).length}
          </span>
        </div>
      )}
    </div>
  );
};

export default ResourceTable;
