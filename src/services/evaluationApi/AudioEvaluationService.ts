import { API_CONFIG } from "@/config/api";
import { createOrUpdateEvaluation } from "@/data/mockups/userData";
import type { Evaluation } from "@/data/types/UserData";
import { baseService } from "../api/baseService";

interface AudioEvaluationRequest {
  audioBlob: Blob;
  resourceId: string;
  userId: string;
}

export class AudioEvaluationService {
  static async evaluateAudio(
    request: AudioEvaluationRequest
  ): Promise<Evaluation> {
    try {
      if (API_CONFIG.USE_MOCK_API) {
        const mockEvaluation = await this.mockEvaluateAudio(request);
        const progressEvaluation = {
          audioUrl: "audio_url_placeholder",
          totalScore: mockEvaluation.totalScore,
          clarityScore: mockEvaluation.clarityScore,
          speedScore: mockEvaluation.speedScore,
          rythmScore: mockEvaluation.rythmScore,
          articulationScore: mockEvaluation.articulationScore,
          clarityTip: mockEvaluation.clarityTip,
          speedTip: mockEvaluation.speedTip,
          rythmTip: mockEvaluation.rythmTip,
          articulationTip: mockEvaluation.articulationTip,
        };

        createOrUpdateEvaluation(
          request.userId,
          request.resourceId,
          progressEvaluation
        );
        await new Promise((resolve) =>
          setTimeout(resolve, API_CONFIG.MOCK_DELAYS.audioAnalysis)
        );

        return mockEvaluation;
      }

      const formData = new FormData();
      formData.append("audio", request.audioBlob, "audio.wav");

      const response = await baseService.makeAudioRequest(
        this.mockEvaluateAudio(request),
        API_CONFIG.AUDIO_ANALYSIS_API.ENDPOINTS.feedback,
        formData
      );

      return response.data;
    } catch (err) {
      console.error("Error evaluating audio:", err);
      throw err;
    }
  }

  static async saveUserProgress(
    userId: string,
    resourceId: string,
    evaluation: Evaluation
  ): Promise<void> {
    try {
      await baseService.makeUserRequest(
        null,
        API_CONFIG.USER_API.ENDPOINTS.createOrUpdateEvaluation,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(evaluation),
        },
        {
          userId,
          resourceId,
        }
      );
    } catch (err) {
      console.error("Error saving user progress:", err);
      throw err;
    }
  }

  private static async mockEvaluateAudio(
    request: AudioEvaluationRequest
  ): Promise<Evaluation> {
    await new Promise((resolve) =>
      setTimeout(resolve, API_CONFIG.MOCK_DELAYS.audioAnalysis)
    );
    const baseScore = Math.floor(Math.random() * 40) + 60; // 60-100

    return {
      audioUrl: `https://example.com/audio/${request.userId}_${request.resourceId}.mp3`,
      totalScore: baseScore,
      clarityScore: baseScore + Math.floor(Math.random() * 10) - 5,
      speedScore: baseScore + Math.floor(Math.random() * 10) - 5,
      rythmScore: baseScore + Math.floor(Math.random() * 10) - 5,
      articulationScore: baseScore + Math.floor(Math.random() * 10) - 5,
      clarityTip: "Good",
      speedTip: "Practice with slower audio",
      rythmTip: "Listen to music to improve rhythm",
      articulationTip: "Do diction exercises",
    };
  }
}
