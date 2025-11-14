import React, { useMemo, useState } from "react"; // <-- Import 'useState'
import { useAudioRecorder } from "@/hooks/evaluationHooks/useAudioRecorder";
import { useAudioEvaluation } from "@/hooks/evaluationHooks/useAudioEvaluation";
import type { FlatEvaluation } from "@/data/interfaces/UserData";
import type { AudioAnalysis } from "../data/interfaces/ResourcesData";
import { FiMic, FiSquare, FiLoader, FiSend, FiCheck } from "react-icons/fi";
import AudioPlayer from "./AudioPlayer";

interface AudioRecorderProps {
  resourceId: string;
  user_id: string | undefined;
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
  user_id,
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

  const [isSaving, setIsSaving] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  const handleEvaluateRecording = async () => {
    if (!audioRecorder.audioBlob || !referenceAnalysis || !user_id) return;
    const result = await audioEvaluation.evaluateAudio({
      audioBlob: audioRecorder.audioBlob,
      resourceId,
      user_id,
      referenceAnalysis,
    });

    if (result && onEvaluationComplete) {
      onEvaluationComplete(result.evaluation, result.analysis);
    }
  };

  const handleSaveClick = async () => {
    if (isSaveSuccess) return;
    setIsSaving(true);
    await onSaveProgress();
    setIsSaving(false);
    setIsSaveSuccess(true);
  };

  const handleToggleRecording = () => {
    if (audioRecorder.isRecording) {
      audioRecorder.stopRecording();
    } else {
      audioEvaluation.clearEvaluation();
      audioRecorder.clearRecording();
      setIsSaveSuccess(false);
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
          {audioRecorder.isRecording
            ? audioRecorder.formattedTime
            : audioRecorder.hasRecording
            ? `${audioRecorder.recordingTime} seconds`
            : `Up to ${Math.round(duration)} seconds`}{" "}
          {attempts > 0 && `• ${attempts} attempts`}
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

      <div className="flex flex-col items-center justify-center">
        {!hasEvaluation && audioRecorder.hasRecording && (
          <div className="flex flex-col items-center">
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

            {audioEvaluation.isEvaluating && (
              <p className="text-xs text-gray-500 mt-2">
                This may take a few seconds...
              </p>
            )}
          </div>
        )}

        {hasEvaluation && (
          <div className="flex flex-col items-center">
            <button
              onClick={handleSaveClick}
              disabled={isSaving || isSaveSuccess}
              className={`font-medium px-8 py-3 rounded-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 ${
                isSaveSuccess
                  ? "bg-green-100 text-green-700"
                  : "bg-[#8BA1E9] text-white hover:bg-[#6786eb]"
              }`}
            >
              {isSaving ? (
                <>
                  <FiLoader className="animate-spin" size={16} />
                  Saving...
                </>
              ) : isSaveSuccess ? (
                <>
                  <FiCheck size={16} />
                  Saved!
                </>
              ) : (
                <>
                  <FiSend size={16} />
                  Save Result
                </>
              )}
            </button>

            {isSaveSuccess && (
              <p className="text-sm text-green-600 font-medium mt-2">
                Progress saved successfully!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
