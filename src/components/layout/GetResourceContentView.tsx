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
  const [showDefinitions, setShowDefinitions] = useState(false);

  const handleTranslateToggle = () => {
    setIsTranslated((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setShowDefinitions(false);
      }
      return nextState;
    });
  };

  const handleDefinitionToggle = () => {
    setShowDefinitions((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setIsTranslated(false);
      }
      return nextState;
    });
  };

  const renderContent = () => {
    switch (type) {
      case "words": {
        const word = resource as Words;

        let contentToShow;
        if (isTranslated) {
          contentToShow = word.translation?.[0] || "No translation";
        } else if (showDefinitions) {
          if (!word.definitions || word.definitions.length === 0) {
            contentToShow = "No definition available";
          } else {
            contentToShow = (
              <div className="flex flex-col gap-3 text-base">
                {" "}
                {word.definitions.map((defGroup, index) => (
                  <div key={index}>
                    <h4 className="font-bold italic text-gray-600 capitalize">
                      {defGroup.pos}
                    </h4>

                    <ul className="list-disc list-inside pl-2 text-gray-800 font-normal">
                      {defGroup.definitions.map((defText, i) => (
                        <li key={i} className="mt-1">
                          {defText}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );
          }
        } else {
          contentToShow = word.text;
        }

        let langIndicator = "English";
        let langEmoji = "🌐"; // O 🇬🇧
        if (isTranslated) {
          langIndicator = "Spanish";
        } else if (showDefinitions) {
          langIndicator = "Definition";
          langEmoji = "📖";
        }

        return (
          <div className="bg-white px-4 pt-3 rounded-lg shadow-md border w-full h-[15rem] border-gray-200">
            <div className="flex flex-wrap gap-4 items-center pb-4 mb-4">
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <span className="text-lg">{langEmoji}</span>
                <span>{langIndicator}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleTranslateToggle}
                  disabled={showDefinitions}
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors text-blue-600 bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTranslated ? "Show Original" : "Translate"}
                </button>

                <button
                  onClick={handleDefinitionToggle}
                  disabled={isTranslated}
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors text-blue-600 bg-blue-50 
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showDefinitions ? "Hide Definition" : "Definition"}
                </button>
              </div>
            </div>

            <div
              className={`leading-relaxed ${
                showDefinitions
                  ? "max-h-[10rem] overflow-y-scroll pr-2 pb-5"
                  : "text-lg text-gray-800 leading-relaxed font-medium"
              }`}
            >
              {!showDefinitions ? <p>{contentToShow}</p> : contentToShow}
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

        let contentToShow;
        if (isTranslated) {
          contentToShow = text.translation || "No translation";
        } else if (showDefinitions) {
          const bookName = text.book_title || "Source not available";

          contentToShow = (
            <div className="text-base text-gray-700">
              <span>Source: </span>
              <span className="font-bold italic">{bookName}</span>
            </div>
          );
        } else {
          contentToShow = text.text;
        }

        let langIndicator = "English";
        let langEmoji = "🌐";
        if (isTranslated) {
          langIndicator = "Spanish";
        } else if (showDefinitions) {
          langIndicator = "Book";
          langEmoji = "📖";
        }

        return (
          <div className="bg-white px-4 pt-3 rounded-lg shadow-md border w-full h-[15rem] border-gray-200 flex flex-col">
            <div className="flex flex-wrap gap-4 items-center pb-4 mb-4 flex-shrink-0">
              <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                <span className="text-lg">{langEmoji}</span>
                <span>{langIndicator}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleTranslateToggle}
                  disabled={showDefinitions}
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors text-blue-600 bg-blue-50
                            disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTranslated ? "Show Original" : "Translate"}
                </button>

                <button
                  onClick={handleDefinitionToggle}
                  disabled={isTranslated}
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors text-blue-600 bg-blue-50
                            disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showDefinitions ? `Hide info` : `More info `}
                </button>
              </div>
            </div>

            <div
              className={`leading-relaxed flex-1 overflow-y-auto ${
                showDefinitions
                  ? "pr-2 pb-5"
                  : "text-lg text-gray-800 leading-relaxed font-medium"
              }`}
            >
              {showDefinitions ? contentToShow : <p>{contentToShow}</p>}
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
