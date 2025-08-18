import type { Evaluation } from "@/data/types/UserData";
import { AudioEvaluationService } from "@/services/evaluationApi/AudioEvaluationService";
import { useCallback, useState } from "react";

interface AudioEvaluationRequest {
  audioBlob: Blob;
  resourceId: string;
  userId: string;
}

interface useAudioEvaluationState {
  isEvaluating: boolean;
  isSaving: boolean;
  evaluation: Evaluation | null;
  error: string | null;
}

export const useAudioEvaluation = () => {
  const [state, setState] = useState<useAudioEvaluationState>({
    isEvaluating: false,
    isSaving: false,
    evaluation: null,
    error: null,
  });

  const evaluateAudio = useCallback(
    async (request: AudioEvaluationRequest): Promise<Evaluation | null> => {
      try {
        setState((prev) => ({
          ...prev,
          isEvaluating: true,
          error: null,
        }));

        const result = await AudioEvaluationService.evaluateAudio(request);

        setState((prev) => ({
          ...prev,
          evaluation: result,
          isEvaluating: false,
        }));

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isEvaluating: false,
        }));

        return null;
      }
    },
    []
  );

  const evaluateAndSave = useCallback(
    async (request: AudioEvaluationRequest): Promise<Evaluation | null> => {
      try {
        setState((prev) => ({
          ...prev,
          isEvaluating: true,
          error: null,
        }));

        const evaluation = await AudioEvaluationService.evaluateAudio(request);

        setState((prev) => ({
          ...prev,
          evaluation,
          isEvaluating: false,
          isSaving: true,
        }));

        await AudioEvaluationService.saveUserProgress(
          request.userId,
          request.resourceId,
          evaluation
        );

        setState((prev) => ({
          ...prev,
          isSaving: false,
        }));

        return evaluation;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error saving evaluation";

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isEvaluating: false,
          isSaving: false,
        }));

        return null;
      }
    },
    []
  );

  return {
    ...state,
    evaluateAudio,
    evaluateAndSave,
  };
};
