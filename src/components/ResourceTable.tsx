import React from "react";
import type { ResourceWithProgress } from "../services/api/createResourceService";
import type { Sentences, Words, Texts } from "../data/interfaces/ResourcesData";
import { AiTwotoneSound } from "react-icons/ai";
import { FaChevronRight, FaSpinner } from "react-icons/fa";
import { truncateText } from "@/utils/resourceUtils";

type ResourceType = "words" | "sentences" | "texts";
type ResourceData = Words | Sentences | Texts;

interface ResourceTableProps {
  resources: ResourceWithProgress<ResourceData>[];
  resourceType: ResourceType;
  onViewResource: (resource_uid: string) => void;
  loading?: boolean;
  category?: string;
}

const ResourceTable: React.FC<ResourceTableProps> = ({
  resources,
  resourceType,
  onViewResource,
  loading = false,
  category = "all",
}) => {
  const getDescription = (
    resource: ResourceWithProgress<ResourceData>
  ): string => {
    const text = (resource.resource as Texts).text;

    if (resourceType === "texts") {
      return truncateText(text, 5);
    }

    return text;
  };

  const formatDuration = (duration: number | null | undefined): string => {
    if (typeof duration !== "number" || isNaN(duration)) {
      return "-";
    }
    return `${Math.round(duration)} sec`;
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center col-span-full">
        <FaSpinner className="animate-spin text-4xl text-gray-400" />
        <div className="text-gray-600 ml-2">Loading...</div>
      </div>
    );
  }

  return (
    <div className="lg:mt-5">
      <div className="flex min-w-full">
        <div className="w-1/12 px-6 py-4 text-left text-sm font-semibold text-[#8BA1E9]">
          Completed
        </div>
        <div className="w-3/12 px-6 py-4 text-left text-sm font-semibold text-[#B77777]">
          Description
        </div>
        <div className="w-2/12 px-6 py-4 text-left text-sm font-semibold text-[#A39E31]">
          Situation
        </div>
        <div className="w-2/12 px-6 py-4 text-left text-sm font-semibold text-[#56AF88]">
          Duration
        </div>
        <div className="w-2/12 px-6 py-4 text-left text-sm font-semibold text-[#8BA1E9]">
          Words
        </div>
        <div className="w-2/12 px-6 py-4"></div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-300">
        <table className="min-w-full bg-white">
          <tbody className="divide-y divide-gray-300">
            {resources.length > 0 ? (
              resources.map((resource) => {
                const status = resource.isCompleted
                  ? "completed"
                  : resource.attempts > 0
                  ? "in-progress"
                  : "pending";

                const statusColors: Record<string, string> = {
                  completed: "bg-blue-500",
                  "in-progress": "bg-rose-500",
                  pending: "bg-white border-2 border-gray-300",
                };

                return (
                  <tr
                    key={resource.resource.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="w-1/12 px-6 py-4">
                      <div className="flex items-center justify-center">
                        <span
                          className={`w-4 h-4 block rounded-full ${statusColors[status]}`}
                        ></span>
                      </div>
                    </td>

                    <td className="w-3/12 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AiTwotoneSound className="text-gray-500" />
                        <span className="font-semibold text-gray-800">
                          {getDescription(resource)}
                        </span>
                      </div>
                    </td>

                    <td className="w-2/12 px-6 py-4 font-medium text-gray-800">
                      {resource.categories?.find(
                        (cat) => cat.toLowerCase() === category.toLowerCase()
                      ) ||
                        resource.categories?.[0] ||
                        "-"}
                    </td>

                    <td className="w-2/12 px-6 py-4 font-medium text-gray-800">
                      {formatDuration(resource.resource.audio_duration)}
                    </td>

                    <td className="w-2/12 px-6 py-4 font-medium text-gray-800">
                      {resource.resource.word_count} words
                    </td>

                    <td className="w-2/12 px-6 py-4">
                      <button
                        onClick={() => onViewResource(resource.resource.id)}
                        className="flex items-center gap-2 text-gray-500 font-semibold hover:text-blue-600"
                      >
                        See more <FaChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No resources found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceTable;
