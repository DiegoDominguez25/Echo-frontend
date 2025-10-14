import { useSentences, useWords, useTexts } from "@/hooks/usersApi";
import type { ResourceWithProgress } from "@/services/api/createResourceService";
import type {
  Sentences,
  Words,
  Texts,
  AudioAnalysis,
} from "@/data/types/ResourcesData";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import type { Evaluation, FlatEvaluation } from "@/data/types/UserData";
import AudioRecorder from "./AudioRecorder";
import type {
  ResourceCompleted,
  UserLevel,
} from "@/services/evaluationApi/AudioEvaluationService";
import { useAudioEvaluation } from "../hooks/evaluationApi/useAudioEvaluation";
import AppHeader from "./layout/AppHeader";
import { FiArrowLeft } from "react-icons/fi";
import AudioPlayer from "./AudioPlayer";
import TranscriptView from "./TranscriptView";
import EvaluationCard from "./EvaluationCard";
import { truncateText } from "@/utils/textUtils";
import no_evaluation from "@/assets/images/no_evaluation.png";
import LevelCard from "./LevelCard";

type ResourceType = "words" | "sentences" | "texts";
type ResourceData = Words | Sentences | Texts;

const ResourceView = () => {
  const { type, resource_uid } = useParams<{
    type: string;
    resource_uid: string;
  }>();
  const navigate = useNavigate();
  const [resource, setResource] =
    useState<ResourceWithProgress<ResourceData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAudioAnalysis, setUserAudioAnalysis] =
    useState<AudioAnalysis | null>(null);
  const [isTranslated, setIsTranslated] = useState(false);
  const [currentUserLevel, setCurrentUserLevel] = useState<UserLevel | null>(
    null
  );

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

  const mapDifficulty = (level: string | number) => {
    switch (String(level)) {
      case "0":
        return "Easy";
      case "1":
        return "Intermediate";
      case "2":
        return "Difficult";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    const loadResource = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!type || !resource_uid) {
          throw new Error("Invalid resource type or ID");
        }

        const resourceType = type as ResourceType;
        if (!["words", "sentences", "texts"].includes(resourceType)) {
          throw new Error("Unsupported resource type");
        }

        const currentHook = resourceHooks[resourceType];
        const resourceData = await currentHook.getByIdWithProgress(
          resource_uid,
          "i7yrtI00NGt8FpTQD2gz"
        );

        setResource(resourceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadResource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, resource_uid]);

  useEffect(() => {
    console.log("🔍 ResourceView state:", {
      resource,
    });
  }, [resource]);

  const handleGoBack = () => {
    navigate("/app/wstbysituation");
  };
  const audioEvaluation = useAudioEvaluation();

  const transformEvaluation = (rawEvaluation: FlatEvaluation): Evaluation => {
    return {
      articulation_score: rawEvaluation.articulation_score,
      clarity_score: rawEvaluation.clarity_score,
      rythm_score: rawEvaluation.rythm_score,
      speed_score: rawEvaluation.speed_score,
      total_score: rawEvaluation.total_score,
      classification: rawEvaluation.classification,
      tips: {
        articulation_tip: rawEvaluation.articulation_tip,
        clarity_tip: rawEvaluation.clarity_tip,
        rythm_tip: rawEvaluation.rythm_tip,
        speed_tip: rawEvaluation.speed_tip,
      },
      audio_url: resource?.resource.audio_url,
    };
  };

  const handleEvaluationComplete = (
    evaluation: FlatEvaluation,
    analysis: AudioAnalysis | null
  ) => {
    console.log("Evaluation completed:", evaluation);
    const transformedEvaluation = transformEvaluation(evaluation);
    setUserAudioAnalysis(analysis);
    setResource((prev) =>
      prev
        ? {
            ...prev,
            evaluation: transformedEvaluation,
            attempts: (prev.attempts || 0) + 1,
          }
        : null
    );
    if (evaluation.classification) {
      setCurrentUserLevel(evaluation.classification as UserLevel);
    }
  };

  const handleSaveProgress = async () => {
    if (
      !resource ||
      !resource_uid ||
      !resource.evaluation ||
      !userAudioAnalysis
    ) {
      console.error("❌ Cannot save progress: Missing required data.", {
        resource,
        evaluation: resource?.evaluation,
        userAudioAnalysis,
      });
      return;
    }

    const progressData: ResourceCompleted = {
      resource_uid: resource_uid,
      type: 1,
      attempts: resource.attempts,
      completed: true,
      last_attempt: new Date().toISOString(),
      completion_date: new Date().toISOString(),
      evaluation: resource.evaluation,
      audio_analysis: userAudioAnalysis,
    };
    const userId = "i7yrtI00NGt8FpTQD2gz";
    const success = await audioEvaluation.saveUserProgress(
      userId,
      progressData
    );
    if (success) {
      console.log("💾 Progress saved successfully:", progressData);
      setResource((prev) =>
        prev
          ? {
              ...prev,
              isCompleted: true,
            }
          : null
      );
    } else {
      console.error("❌ Failed to save progress via hook.");
      console.log(resource.evaluation);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading resource...</p>
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
            Back
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
                {isTranslated ? word.translation?.[0] : word.text}
              </p>
            </div>
          </div>
        );
      }

      case "sentences": {
        const sentence = r as Sentences;

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
        const text = r as Texts;
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
  const resourceText =
    (resource.resource as Sentences).text ||
    (resource.resource as Words).text ||
    (resource.resource as Texts).text;

  const tagColors = [
    {
      bg: "bg-indigo-50",
      border: "border-indigo-300",
      text: "text-indigo-800",
    },
    { bg: "bg-pink-50", border: "border-pink-300", text: "text-pink-800" },
    { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-800" },
  ];
  return (
    <div className="min-h-screen bg-white py-8">
      <AppHeader />
      <div className="grid lg:grid-cols-2 gap-8 items-center px-10">
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-4 text-sm"
          >
            <FiArrowLeft /> Back to resources
          </button>

          <div className="flex items-center flex-wrap gap-2 text-lg font-medium text-[#8BA1E9]">
            <span>Resources</span>
            <span>&gt;</span>
            <span>
              {type && (
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              )}
            </span>
            <span>&gt;</span>
            <span>By Situation</span>
            <span>&gt;</span>
            <span>{resource.categories[0]}</span>
            <span>&gt;</span>
            <span>{mapDifficulty(resource.difficulty)}</span>
          </div>

          <h1 className="text-4xl font-bold text-indigo-400 mt-2">
            {`${truncateText(resourceText, 5)}`}
          </h1>

          <div className="flex flex-wrap items-center gap-3 my-4">
            {resource.categories.map((category, index) => {
              const color = tagColors[index % tagColors.length];
              return (
                <span
                  key={index}
                  className={`px-4 py-0.5 text-sm font-medium rounded-full border ${color.bg} ${color.border} ${color.text}`}
                >
                  {category}
                </span>
              );
            })}
          </div>

          <div className=" flex flex-col bg-white rounded-lg mb-8">
            {getResourceContent()}
            {resource.resource.audio_url && (
              <AudioPlayer
                src={resource.resource.audio_url}
                waveColor="#8BA1E9"
                progressColor="#5575DE"
              />
            )}

            <TranscriptView
              transcript={
                userAudioAnalysis?.transcription ||
                resource.progress?.audio_analysis.transcription
              }
            />

            <div className="w-full mt-5">
              <AudioRecorder
                resourceId={resource_uid!}
                userId="i7yrtI00NGt8FpTQD2gz"
                duration={resource.resource.audio_duration}
                onEvaluationComplete={handleEvaluationComplete}
                onSaveProgress={handleSaveProgress}
                referenceAnalysis={resource?.resource?.audio_analysis}
                attempts={resource.attempts || 0}
              />
            </div>
          </div>
        </div>
        <div>
          {resource.evaluation ? (
            <div className="min-w-3/4 justify-self-center">
              <EvaluationCard
                evaluation={resource.evaluation}
                lastAttempt={resource.progress?.completion_date.toString()}
              />
            </div>
          ) : (
            <div className="bg-slate-50 border flex flex-col border-gray-200/80 rounded-xl p-4 md:p-6 space-y-4 h-1/2 items-center justify-center">
              <div className="bg-white p-5 rounded-xl">
                <img
                  src={no_evaluation}
                  className="h-80 w-auto object-contain"
                />
                <div className="text-center mt-5 font-medium text-gray-500">
                  <p>Submit your recording to get an evaluation.</p>
                </div>
              </div>
            </div>
          )}
          {currentUserLevel || resource.progress ? (
            <div className="mt-5">
              <LevelCard
                label={
                  (resource.progress?.evaluation.classification as UserLevel) ||
                  currentUserLevel
                }
              />
            </div>
          ) : (
            <div className={`rounded-xl p-6 shadow-sm mt-5`}>
              <h3 className={`text-xl font-bold text-center w-full`}>
                No user level estimated yet
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceView;
