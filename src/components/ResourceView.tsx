import { useSentences, useWords, useTexts } from "@/hooks/usersApi";
import type { ResourceWithProgress } from "@/services/api/createResourceService";
import type { Sentences, Words, Texts } from "@/data/types/ResourcesData";
import type React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import type { Evaluation } from "@/data/types/UserData";
import AudioRecorder from "./AudioRecorder";

type ResourceType = "words" | "sentences" | "texts";
type ResourceData = Words | Sentences | Texts;

interface ResourceViewProps {
  type: ResourceType;
  id: string;
}

const ResourceView: React.FC<ResourceViewProps> = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [resource, setResource] =
    useState<ResourceWithProgress<ResourceData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const wordsHook = useWords();
  const sentencesHook = useSentences();
  const textsHook = useTexts();

  const resourceHooks = useMemo(
    () => ({
      words: wordsHook,
      sentences: sentencesHook,
      texts: textsHook,
    }),
    [wordsHook, sentencesHook, textsHook]
  );

  useEffect(() => {
    const loadResource = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!type || !id) {
          throw new Error("Invalid resource type or ID");
        }

        const resourceType = type as ResourceType;
        if (!["words", "sentences", "texts"].includes(resourceType)) {
          throw new Error("Unsupported resource type");
        }

        const currentHook = resourceHooks[resourceType];
        const resourceData = await currentHook.getByIdWithProgress(
          id,
          "user_001"
        );

        setResource(resourceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [type, id]);

  const handleGoBack = () => {
    navigate("/app/wstbysituation");
  };

  const handleEvaluationComplete = (evaluation: Evaluation) => {
    console.log("Evaluation completed:", evaluation);

    setResource((prev) =>
      prev
        ? {
            ...prev,
            evaluation,
            isCompleted: true,
            attempts: prev?.attempts + 1,
          }
        : null
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading animation</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleGoBack}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Resource not found
          </h2>
          <p className="text-gray-600 mb-4">
            The resource you are looking for does not exist or has been deleted.
          </p>
          <button
            onClick={handleGoBack}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  const getResourceContent = () => {
    const r = resource.resource;

    switch (type) {
      case "words": {
        const word = r as Words;
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {word.text}
              </h1>
              <p className="text-lg text-gray-600">{word.ipa}</p>
              <p className="text-xl text-blue-600 font-medium">
                {word.translation}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Definitions</h3>
              {word.definitions.map((def, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {def.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-gray-900 mt-2">{def.meaning}</p>
                  <p className="text-gray-600 text-sm mt-1 italic">
                    "{def.example}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "sentences": {
        const sentence = r as Sentences;
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Sentence
              </h1>
              <p className="text-lg text-gray-800 bg-gray-50 p-4 rounded-lg">
                {sentence.text}
              </p>
              <p className="text-lg text-blue-600 mt-2">
                {sentence.translation}
              </p>
            </div>
          </div>
        );
      }

      case "texts": {
        const text = r as Texts;
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {text.text}
              </h1>
              <div className="prose max-w-none">
                <p className="text-gray-800 leading-relaxed">{text.text}</p>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-900 font-medium">Translation:</p>
                <p className="text-blue-800">{text.translation}</p>
              </div>
            </div>
          </div>
        );
      }

      default:
        return <p>Unrecognized resource type</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <span className="mr-2">←</span>
            Get back
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {type === "words"
                ? "Words"
                : type === "sentences"
                ? "Sentence"
                : "Text"}
            </span>
            <span
              className={`text-sm px-3 py-1 rounded-full ${"bg-gray-100 text-gray-800"}`}
            ></span>
            {resource.categories.map((category, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span
              className={`font-medium ${
                resource.isCompleted ? "text-green-600" : "text-gray-600"
              }`}
            >
              {resource.isCompleted ? "✅ Completed" : "⏳ Pending"}
            </span>
            {resource.attempts > 0 && (
              <span>
                🔄 {resource.attempts} attempt
                {resource.attempts !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {getResourceContent()}
        </div>

        <AudioRecorder
          resourceId={id!}
          userId="user_001"
          duration={3}
          onEvaluationComplete={handleEvaluationComplete}
        />

        {resource.evaluation && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Evaluation</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total score:</span>
                <span className="ml-2 font-medium">
                  {resource.evaluation.totalScore}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Clarity score:</span>
                <span className="ml-2 font-medium">
                  {resource.evaluation.clarityScore}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Speed score:</span>
                <span className="ml-2 font-medium">
                  {resource.evaluation.speedScore}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Rythm score:</span>
                <span className="ml-2 font-medium">
                  {resource.evaluation.rythmScore}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Articulation score:</span>
                <span className="ml-2 font-medium">
                  {resource.evaluation.articulationScore}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Clarity tip:</span>
                <span className="ml-2 font-medium">
                  {resource.evaluation.clarityTip}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Speed tip:</span>
                <span className="ml-2 font-medium">
                  {resource.evaluation.speedTip}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Rythm tip:</span>
                <span className="ml-2 font-medium">
                  {resource.evaluation.rythmTip}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Articulation tip:</span>
                <span className="ml-2 font-medium">
                  {resource.evaluation.articulationTip}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          {resource.resource.audioUrl && (
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
              Play audio
            </button>
          )}

          <button
            onClick={handleGoBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceView;
