import type { FlatEvaluation } from "@/data/interfaces/UserData";
import {
  AudioEvaluationService,
  type ResourceCompleted,
} from "@/services/evaluationApi/AudioEvaluationService";
import { useCallback, useState } from "react";
import type { AudioAnalysis } from "../../data/interfaces/ResourcesData";

interface AudioEvaluationRequest {
  audioBlob: Blob;
  resourceId: string;
  userId: string;
  referenceAnalysis: AudioAnalysis;
}

interface useAudioEvaluationState {
  isEvaluating: boolean;
  isSaving: boolean;
  evaluation: FlatEvaluation | null;
  error: string | null;
}

export const useAudioEvaluation = () => {
  const [state, setState] = useState<useAudioEvaluationState>({
    isEvaluating: false,
    isSaving: false,
    evaluation: null,
    error: null,
  });

  const [userAudioAnalysis, setUserAudioAnalysis] =
    useState<AudioAnalysis | null>(null);

  const evaluateAudio = useCallback(
    async (
      request: AudioEvaluationRequest
    ): Promise<{
      evaluation: FlatEvaluation;
      analysis: AudioAnalysis;
    } | null> => {
      try {
        setState((prev) => ({
          ...prev,
          isEvaluating: true,
          error: null,
        }));

        const analysis = await AudioEvaluationService.analyzeAudio({
          audioBlob: request.audioBlob,
        });

        setUserAudioAnalysis(analysis);

        const [evaluation, feedback, userLevel] = await Promise.all([
          AudioEvaluationService.evaluateAnalysis(
            analysis,
            request.referenceAnalysis
          ),
          AudioEvaluationService.getFeedback(
            analysis,
            request.referenceAnalysis
          ),
          AudioEvaluationService.determineUserLevel(
            analysis,
            request.referenceAnalysis
          ),
        ]);

        const result: FlatEvaluation = {
          articulation_score: evaluation.articulation_score,
          clarity_score: evaluation.clarity_score,
          rythm_score: evaluation.rythm_score,
          speed_score: evaluation.speed_score,
          total_score: evaluation.total_score,
          articulation_tip: feedback.articulation_tip,
          clarity_tip: feedback.clarity_tip,
          rythm_tip: feedback.rythm_tip,
          speed_tip: feedback.speed_tip,
          classification: userLevel,
        };

        setState((prev) => ({
          ...prev,
          evaluation: result,
          isEvaluating: false,
        }));

        return { evaluation: result, analysis };
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

  const saveUserProgress = useCallback(
    async (
      userId: string,
      resourceCompleted: ResourceCompleted
    ): Promise<boolean> => {
      try {
        setState((prev) => ({
          ...prev,
          isSaving: true,
          error: null,
        }));

        console.log(`💾 Saving user progress: ${userId}`);

        await AudioEvaluationService.saveUserProgress(
          userId,
          resourceCompleted
        );

        setState((prev) => ({
          ...prev,
          isSaving: false,
        }));

        console.log(`✅ User progress saved successfully`);
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to save user progress";

        console.error(`❌ Error saving user progress:`, error);

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isSaving: false,
        }));

        return false;
      }
    },
    []
  );

  const clearEvaluation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      evaluation: null,
      error: null,
      isEvaluating: false,
      isSaving: false,
    }));
    setUserAudioAnalysis(null);
  }, []);

  return {
    ...state,
    evaluateAudio,
    saveUserProgress,
    clearEvaluation,
    userAudioAnalysis,
  };
};
