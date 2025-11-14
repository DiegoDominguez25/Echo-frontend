import type { AudioAnalysis } from "@/data/interfaces/ResourcesData";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { FlatEvaluation } from "@/data/interfaces/UserData";
import AudioRecorder from "./AudioRecorder";
import type {
  ResourceCompleted,
  UserLevel,
} from "@/services/evaluationApi/AudioEvaluationService";
import { useAudioEvaluation } from "../hooks/evaluationHooks/useAudioEvaluation";
import AppHeader from "./layout/AppHeader";
import { SiBilibili } from "react-icons/si";

import AudioPlayer from "./AudioPlayer";
import TranscriptView from "./TranscriptView";
import EvaluationCard from "./EvaluationCard";
import { truncateText } from "@/utils/resourceUtils";
import no_evaluation from "@/assets/images/no_evaluation.png";
import LevelCard from "./LevelCard";
import { mapDifficulty, transformEvaluation } from "@/utils/resourceUtils";
import { useResource } from "@/hooks/resourceHooks/useResource";
import { tagColors } from "@/constants/resourceConstants";
import GetResourceContentView from "./layout/GetResourceContentView";
import { useAuth } from "@/hooks/useAuth";
import { FiArrowLeft } from "react-icons/fi";

const ResourceView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userAudioAnalysis, setUserAudioAnalysis] =
    useState<AudioAnalysis | null>(null);
  const [currentUserLevel, setCurrentUserLevel] = useState<UserLevel | null>(
    null
  );

  const { resource, setResource, loading, error, type, resource_uid } =
    useResource(user?.id);

  useEffect(() => {
    console.log("🔍 ResourceView state:", {
      resource,
    });
  }, [resource]);

  const handleGoBack = () => {
    navigate(-1);
  };
  const audioEvaluation = useAudioEvaluation();

  const handleEvaluationComplete = (
    evaluation: FlatEvaluation,
    analysis: AudioAnalysis | null
  ) => {
    console.log("Evaluation completed:", evaluation);
    const transformedEvaluation = transformEvaluation(
      evaluation,
      resource?.resource.audio_url
    );
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
      console.error("Cannot save progress: Missing required data.", {
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

    const success = await audioEvaluation.saveUserProgress(
      user?.id,
      progressData
    );
    if (success) {
      console.log("Progress saved successfully:", progressData);
      setResource((prev) =>
        prev
          ? {
              ...prev,
              isCompleted: true,
            }
          : null
      );
    } else {
      console.error("Failed to save progress via hook.");
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

  return (
    <div className="min-h-screen bg-white py-8">
      <AppHeader />
      <div className="px-10 mb-8">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-800 hover:text-black mb-4 text-lg font-medium"
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
          <span className="capitalize">{resource.categories[0]}</span>
          <span>&gt;</span>
          <span>{mapDifficulty(resource.difficulty)}</span>
        </div>

        <h1 className="text-4xl font-bold text-indigo-400 mt-2">
          {`${truncateText(resource.resource.text, 5)}`}
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
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start px-10">
        <div className=" flex flex-col bg-white rounded-lg mb-8">
          <GetResourceContentView resource={resource.resource} type={type} />
          {resource.resource.audio_url && (
            <AudioPlayer
              src={resource.resource.audio_url}
              waveColor="#8BA1E9"
              progressColor="#5575DE"
            />
          )}

          <div className="w-full mt-5">
            <AudioRecorder
              resourceId={resource_uid!}
              user_id={user?.id}
              duration={resource.resource.audio_duration}
              onEvaluationComplete={handleEvaluationComplete}
              onSaveProgress={handleSaveProgress}
              referenceAnalysis={resource?.resource?.audio_analysis}
              attempts={resource.attempts || 0}
            />
          </div>
          <TranscriptView
            transcript={
              userAudioAnalysis?.transcription ||
              resource.progress?.audio_analysis.transcription
            }
          />
        </div>

        <div>
          {audioEvaluation.error ? (
            <div className="bg-red-50 border flex flex-col border-red-200/80 rounded-xl p-4 space-y-4 items-center justify-center">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Evaluation Failed
                </h2>
                <p className="text-gray-600 mb-6">{audioEvaluation.error}</p>
                <button className="text-[#8BA1E9] px-4 py-3 rounded-md">
                  Please try again
                </button>
              </div>
            </div>
          ) : resource.evaluation ? (
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
                <div className="text-center mt-5 font-bold text-gray-600 text-xl">
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
            <div
              className={`rounded-xl border p-6 shadow-sm bg-gray-100 border-gray-400 transition-all duration-300 mt-5`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full`}
                >
                  <SiBilibili className="h-6 w-6" />
                </div>
                <div className="flex items-center">
                  <h3 className={`font-bold text-gray-600`}>
                    No performance level estimated yet.
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceView;
