import type { Words, Sentences, Texts } from "@/data/interfaces/ResourcesData";
import { useState } from "react";

type ResourceData = Words | Sentences | Texts;

interface getResourceContentProps {
  resource: ResourceData;
  type: string | undefined;
}

const GetResourceContentView = ({
  resource,
  type,
}: getResourceContentProps) => {
  const [isTranslated, setIsTranslated] = useState(false);

  const handleTranslateToggle = () => {
    setIsTranslated((prevState) => !prevState);
  };

  const renderContent = () => {
    switch (type) {
      case "words": {
        const word = resource as Words;

        return (
          <div className="bg-white pb-30 px-4 pt-3 rounded-lg shadow-md border w-full border-gray-200">
            <div className="flex gap-5 items-center pb-4 border-gray-200 mb-4">
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <span className="text-lg">🌐</span>
                <span>{isTranslated ? "Spanish" : "English"}</span>
              </div>
              <button
                onClick={handleTranslateToggle}
                className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-b-sm transition-colors"
              >
                {isTranslated ? "Show Original" : "Translate"}
              </button>
            </div>

            <div>
              <p className="text-lg text-gray-800 leading-relaxed font-medium">
                {isTranslated ? word.translation?.[0] : word.text}
              </p>
            </div>
          </div>
        );
      }

      case "sentences": {
        const sentence = resource as Sentences;

        const handleTranslateToggle = () => {
          setIsTranslated((prevState) => !prevState);
        };

        return (
          <div className="bg-white pb-30 px-4 pt-3 rounded-lg shadow-md border w-full border-gray-200">
            <div className="flex gap-5 items-center pb-4 border-gray-200 mb-4">
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <span className="text-lg">🌐</span>
                <span>{isTranslated ? "Spanish" : "English"}</span>
              </div>
              <button
                onClick={handleTranslateToggle}
                className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-b-sm transition-colors"
              >
                {isTranslated ? "Show Original" : "Translate"}
              </button>
            </div>

            <div>
              <p className="text-lg text-gray-800 leading-relaxed font-medium">
                {isTranslated ? sentence.translation : sentence.text}
              </p>
            </div>
          </div>
        );
      }

      case "texts": {
        const text = resource as Texts;
        const handleTranslateToggle = () => {
          setIsTranslated((prevState) => !prevState);
        };

        return (
          <div className="bg-white pb-30 px-4 pt-3 rounded-lg shadow-md border w-full border-gray-200">
            <div className="flex gap-5 items-center pb-4 border-gray-200 mb-4">
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <span className="text-lg">🌐</span>
                <span>{isTranslated ? "Spanish" : "English"}</span>
              </div>
              <button
                onClick={handleTranslateToggle}
                className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-b-sm transition-colors"
              >
                {isTranslated ? "Show Original" : "Translate"}
              </button>
            </div>

            <div>
              <p className="text-lg text-gray-800 leading-relaxed font-medium">
                {isTranslated ? text.translation : text.text}
              </p>
            </div>
          </div>
        );
      }

      default:
        return <p>Unrecognized resource type</p>;
    }
  };
  return <>{renderContent()}</>;
};

export default GetResourceContentView;
