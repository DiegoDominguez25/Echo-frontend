import { API_CONFIG } from "@/config/api";
import type { Evaluation, FlatEvaluation } from "@/data/interfaces/UserData";
import { baseService } from "../api/baseService";
import type { AudioAnalysis } from "@/data/interfaces/ResourcesData";

interface AudioAnalysisRequest {
  audioBlob: Blob;
  resourceId?: string;
  userId?: string;
}

interface AudioEvaluationRequest extends AudioAnalysisRequest {
  referenceAnalysis: AudioAnalysis;
}

export interface ResourceCompleted {
  attempts: number;
  audio_analysis: AudioAnalysis;
  completed: boolean;
  completion_date: string;
  evaluation: Evaluation;
  last_attempt: string;
  resource_uid: string;
  type: number;
}

export type UserLevel = "Beginner" | "Intermediate" | "Advanced";

interface UserLevelResponse {
  label: UserLevel;
}

export interface EvaluationForDB {
  articulation_score: number;
  articulation_tip: string;
  clarity_score: number;
  clarity_tip: string;
  rythm_score: number;
  rythm_tip: string;
  speed_score: number;
  speed_tip: string;
  total_score: number;
  audio_url?: string;
}

export class AudioEvaluationService {
  static async analyzeAudio(
    request: AudioAnalysisRequest
  ): Promise<AudioAnalysis> {
    try {
      const formData = new FormData();
      formData.append("audio_file", request.audioBlob, "audio.wav");

      const response = await baseService.makeAudioRequest<AudioAnalysis>(
        API_CONFIG.AUDIO_ANALYSIS_API.ENDPOINTS.analyze,
        formData
      );

      console.log("Audio analysis response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error evaluating audio:", err);
      throw err;
    }
  }

  static async evaluateAnalysis(
    userAnalysis: AudioAnalysis,
    referenceAnalysis: AudioAnalysis
  ): Promise<Evaluation> {
    try {
      console.log("Starting audio comparison with reference...");

      const userAnalysisString = JSON.stringify(userAnalysis);
      const referenceAnalysisString = JSON.stringify(referenceAnalysis);

      console.log("📤 JSON strings to send:", {
        userAnalysisLength: userAnalysisString.length,
        referenceAnalysisLength: referenceAnalysisString.length,
        userAnalysisPreview: userAnalysisString.substring(0, 200) + "...",
        referenceAnalysisPreview:
          referenceAnalysisString.substring(0, 200) + "...",
      });

      const formData = new FormData();
      formData.append("user_analysis", userAnalysisString);
      formData.append("reference_analysis", referenceAnalysisString);

      console.log("FormData contents:", {
        entries: Array.from(formData.entries()).map(([key, value]) => ({
          key,
          valueType: typeof value,
        })),
      });

      const response = await baseService.makeFileRequest<Evaluation>(
        API_CONFIG.AUDIO_ANALYSIS_API.BASE_URL,
        API_CONFIG.AUDIO_ANALYSIS_API.ENDPOINTS.feedback,
        formData
      );

      console.log("Audio comparison response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error comparing audio analyses:", err);
      throw err;
    }
  }

  static async getFeedback(
    userAnalysis: AudioAnalysis,
    referenceAnalysis: AudioAnalysis
  ): Promise<FlatEvaluation> {
    const userAnalysisString = JSON.stringify(userAnalysis);
    const referenceAnalysisString = JSON.stringify(referenceAnalysis);

    const formData = new FormData();

    formData.append("user_analysis", userAnalysisString);
    formData.append("reference_analysis", referenceAnalysisString);

    console.log("Data to send in formData:", {
      user_analysis: userAnalysisString,
      reference_analysis: referenceAnalysisString,
    });

    try {
      console.log("Try with ARLI IA ...");
      const promiseProduction =
        await baseService.makeFileRequest<FlatEvaluation>(
          API_CONFIG.AUDIO_ANALYSIS_API.BASE_URL,
          API_CONFIG.AUDIO_ANALYSIS_API.ENDPOINTS.tips,
          formData
        );

      console.log("Success with ARLI IA:", promiseProduction.data);
      return promiseProduction.data;
    } catch (errProduction) {
      console.warn("Error with ARLI IA:", errProduction);
      console.log("Attempt 2: Falling back to 'tips' (production)...");

      try {
        const promiseLocal = await baseService.makeFileRequest<FlatEvaluation>(
          API_CONFIG.AUDIO_ANALYSIS_API.BASE_URL,
          API_CONFIG.AUDIO_ANALYSIS_API.ENDPOINTS.tips_local,
          formData
        );

        console.log("Success with 'tips' (local):", promiseLocal.data);
        return promiseLocal.data;
      } catch (errLocal) {
        console.error("Both attempts failed (local and production):", errLocal);

        throw errProduction;
      }
    }
  }

  static async evaluateCompleteAudio(
    evaluationRequest: AudioEvaluationRequest
  ): Promise<Evaluation> {
    try {
      console.log("Starting complete audio evaluation flow...");

      const userAnalysis = await this.analyzeAudio({
        audioBlob: evaluationRequest.audioBlob,
        resourceId: evaluationRequest.resourceId,
        userId: evaluationRequest.userId,
      });

      console.log("Step 1 completed: User audio analyzed");

      const evaluation = await this.evaluateAnalysis(
        userAnalysis,
        evaluationRequest.referenceAnalysis
      );

      const userLevel = await this.determineUserLevel(
        userAnalysis,
        evaluationRequest.referenceAnalysis
      );

      const feedback = await this.getFeedback(
        userAnalysis,
        evaluationRequest.referenceAnalysis
      );

      console.log("Step 2 completed: Audio comparison evaluated");
      console.log("Complete audio evaluation flow finished!");

      const completeEvaluation: Evaluation = {
        ...evaluation,
        ...feedback,
        classification: userLevel,
      };

      return completeEvaluation;
    } catch (err) {
      console.error("Error in complete audio evaluation:", err);
      throw err;
    }
  }

  static async determineUserLevel(
    userAnalysis: AudioAnalysis,
    referenceAnalysis: AudioAnalysis
  ): Promise<UserLevel> {
    try {
      console.log("Determining user level based on audio analysis...");

      const userAnalysisString = JSON.stringify(userAnalysis);
      const referenceAnalysisString = JSON.stringify(referenceAnalysis);

      const formData = new FormData();

      formData.append("reference_analysis", referenceAnalysisString);
      formData.append("user_analysis", userAnalysisString);

      console.log("🔬 FormData for user level determination:", {
        user_analysis: userAnalysisString.substring(0, 100) + "...",
        reference_analysis: referenceAnalysisString.substring(0, 100) + "...",
      });

      const response = await baseService.makeFileRequest<UserLevelResponse>(
        API_CONFIG.AUDIO_ANALYSIS_API.BASE_URL,
        API_CONFIG.AUDIO_ANALYSIS_API.ENDPOINTS.classification,
        formData
      );

      console.log("User level received:", response);

      return response.data.label;
    } catch (err) {
      console.error("Error determining user level:", err);
      throw err;
    }
  }

  static async saveUserProgress(
    userId: string,
    resourceCompleted: ResourceCompleted
  ): Promise<void> {
    console.log("--- DEBUG: Enviando Progreso a la API ---");
    console.log(
      "Endpoint:",
      API_CONFIG.USER_API.ENDPOINTS.createOrUpdateEvaluation
    );
    console.log("User ID (param):", userId);
    // Usamos JSON.stringify con 'null, 2' para "imprimir bonito" el objeto
    console.log("Payload (body):", JSON.stringify(resourceCompleted, null, 2));
    // --- FIN DEL BLOQUE DE DEBUG ---
    try {
      await baseService.makeUserRequest(
        API_CONFIG.USER_API.ENDPOINTS.createOrUpdateEvaluation,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resourceCompleted),
        },
        {
          uid_user: userId,
        }
      );
    } catch (err) {
      console.error("Error saving user progress:", err);
      throw err;
    }
  }
}
