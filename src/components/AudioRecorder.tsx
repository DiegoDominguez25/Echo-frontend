import React, { useMemo } from "react";
import { useAudioRecorder } from "@/hooks/evaluationHooks/useAudioRecorder";
import { useAudioEvaluation } from "@/hooks/evaluationHooks/useAudioEvaluation";
import type { FlatEvaluation } from "@/data/interfaces/UserData";
import type { AudioAnalysis } from "../data/interfaces/ResourcesData";
import { FiMic, FiSquare, FiLoader, FiSend } from "react-icons/fi";
import AudioPlayer from "./AudioPlayer";

interface AudioRecorderProps {
  resourceId: string;
  userId: string;
  duration: number;
  onEvaluationComplete: (
    evaluation: FlatEvaluation,
    userAnalysis: AudioAnalysis
  ) => void;
  onSaveProgress: () => void;
  referenceAnalysis: AudioAnalysis | null | undefined;
  attempts: number;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  resourceId,
  userId,
  duration,
  onEvaluationComplete,
  onSaveProgress,
  referenceAnalysis,
  attempts,
}) => {
  const recorderOptions = useMemo(
    () => ({
      duration: duration + 4,
      mimeType: "audio/wav" as const,
    }),
    [duration]
  );

  const audioRecorder = useAudioRecorder(recorderOptions);
  const audioEvaluation = useAudioEvaluation();

  const handleEvaluateRecording = async () => {
    if (!audioRecorder.audioBlob || !referenceAnalysis) return;
    const result = await audioEvaluation.evaluateAudio({
      audioBlob: audioRecorder.audioBlob,
      resourceId,
      userId,
      referenceAnalysis,
    });

    if (result && onEvaluationComplete) {
      onEvaluationComplete(result.evaluation, result.analysis);
    }
  };

  const handleToggleRecording = () => {
    if (audioRecorder.isRecording) {
      audioRecorder.stopRecording();
    } else {
      audioEvaluation.clearEvaluation();
      audioRecorder.clearRecording();
      audioRecorder.startRecording();
    }
  };

  const hasEvaluation = !!audioEvaluation.evaluation;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <button
            onClick={handleToggleRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
              audioRecorder.isRecording
                ? "bg-red-500 text-white shadow-lg transform scale-105"
                : "bg-red-50 text-red-500 hover:bg-red-100 border-2 border-red-200"
            }`}
          >
            {audioRecorder.isRecording ? (
              <FiSquare size={24} />
            ) : (
              <FiMic size={24} />
            )}
          </button>

          {audioRecorder.isRecording && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-sm font-medium text-gray-700 mb-1">
          {audioRecorder.isRecording
            ? "Recording..."
            : audioRecorder.hasRecording
            ? "Recording complete"
            : "Record yourself"}
        </p>
        <p className="text-xs text-gray-500">
          {audioRecorder.formattedTime}
          {attempts > 0 && ` • ${attempts} attempts`}
        </p>
      </div>

      {audioRecorder.audioUrl && (
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-xs text-gray-600 font-medium">
                Your recording
              </span>
            </div>
            <AudioPlayer
              src={audioRecorder.audioUrl}
              waveColor="#E5E7EB"
              progressColor="#EF4444"
            />
          </div>
        </div>
      )}

      <div className="flex justify-center">
        {!hasEvaluation && audioRecorder.hasRecording && (
          <button
            onClick={handleEvaluateRecording}
            disabled={audioEvaluation.isEvaluating}
            className="bg-red-100 text-red-600 font-medium px-8 py-3 rounded-full hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {audioEvaluation.isEvaluating ? (
              <>
                <FiLoader className="animate-spin" size={16} />
                Evaluating...
              </>
            ) : (
              "Get Evaluation"
            )}
          </button>
        )}

        {hasEvaluation && (
          <button
            onClick={onSaveProgress}
            disabled={audioEvaluation.isSaving}
            className="bg-[#8BA1E9] text-white font-medium px-8 py-3 rounded-full hover:bg-[#6786eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {audioEvaluation.isSaving ? (
              <>
                <FiLoader className="animate-spin" size={16} />
                Saving...
              </>
            ) : (
              <>
                <FiSend size={16} />
                Save Result
              </>
            )}
          </button>
        )}
      </div>

      {hasEvaluation && (
        <div className="text-center mt-4">
          <p className="text-sm text-[#8BA1E9] font-medium">
            ✓ Evaluation complete!
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
