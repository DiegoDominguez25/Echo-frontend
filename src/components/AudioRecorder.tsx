import React from "react";
import { useAudioRecorder } from "@/hooks/evaluationApi/useAudioRecorder";
import { useAudioEvaluation } from "@/hooks/evaluationApi/useAudioEvaluation";
import type { Evaluation } from "@/data/types/UserData";
import type { AudioAnalysis } from "../data/types/ResourcesData";

interface AudioRecorderProps {
  resourceId: string;
  userId: string;
  duration?: number;
  referenceText?: string;
  onEvaluationComplete?: (evaluation: Evaluation) => void;
  referenceAnalysis: AudioAnalysis;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  resourceId,
  userId,
  duration = 10,
  onEvaluationComplete,
  referenceAnalysis,
}) => {
  const audioRecorder = useAudioRecorder({
    duration,
    mimeType: "audio/wav",
  });

  const audioEvaluation = useAudioEvaluation();

  const handleEvaluateRecording = async () => {
    if (!audioRecorder.audioBlob) return;

    const result = await audioEvaluation.evaluateAudio({
      audioBlob: audioRecorder.audioBlob,
      resourceId,
      userId,
      referenceAnalysis,
    });

    if (result && onEvaluationComplete) {
      onEvaluationComplete(result);
    }
  };

  return (
    <div>
      <h3>Audio practice</h3>

      {duration && (
        <div>
          <p>
            Duration: {duration}s Max duration is {audioRecorder.maxDuration}s
          </p>
        </div>
      )}

      {(audioRecorder.error || audioEvaluation.error) && (
        <div>
          <p>{audioRecorder.error || audioEvaluation.error}</p>
          <button
            onClick={() => {
              audioRecorder.clearError();
            }}
          >
            Clear Error
          </button>
        </div>
      )}

      {!audioRecorder.isSupported && (
        <div>
          <p>Audio recording is not supported in this browser.</p>
        </div>
      )}

      <div>
        <div>{audioRecorder.formattedTime}</div>
        <div>
          {audioRecorder.isRecording
            ? audioRecorder.isPaused
              ? "Paused"
              : "Recording..."
            : "Ready to record"}
        </div>
      </div>

      {duration && (
        <div>
          <div>
            <div>{audioRecorder.progressPercentage}</div>
          </div>
          <div>Max: {audioRecorder.maxDuration}s</div>
        </div>
      )}

      {!audioRecorder.isRecording ? (
        <button
          onClick={audioRecorder.startRecording}
          disabled={!audioRecorder.canRecord}
          className={`
              px-6 py-3 rounded-full font-medium flex items-center gap-2
              ${
                audioRecorder.canRecord
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={audioRecorder.stopRecording}
          className="px-6 py-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white font-medium flex items-center gap-2"
        >
          Stop Recording
        </button>
      )}
      {audioRecorder.hasRecording && !audioRecorder.isRecording && (
        <button onClick={audioRecorder.clearRecording}>Clear</button>
      )}

      {audioRecorder.hasRecording && (
        <div>
          Your recording:
          <audio src={audioRecorder.audioUrl!} controls>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {audioRecorder.hasRecording && !audioRecorder.isRecording && (
        <div>
          <button
            onClick={handleEvaluateRecording}
            disabled={audioEvaluation.isEvaluating}
          >
            {audioEvaluation.isEvaluating
              ? "Analyzing..."
              : audioEvaluation.isSaving
              ? "Saving..."
              : "Evaluate Recording"}
          </button>
        </div>
      )}

      {audioEvaluation.isEvaluating && (
        <div>
          <p>Analyzing your pronunciation...</p>
        </div>
      )}

      {audioEvaluation.isSaving && (
        <div>
          <p>Saving your progress...</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
