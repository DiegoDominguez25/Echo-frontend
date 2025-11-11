import { useState, useRef, useCallback, useEffect } from "react";

interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
  isSupported: boolean;
}

interface AudioRecorderConfig {
  duration?: number;
  tolerancePercentage?: number;
  mimeType?: string;
  audioBitsPerSecond?: number;
}

export const useAudioRecorder = (config: AudioRecorderConfig = {}) => {
  const {
    duration = 10,
    tolerancePercentage = 20,
    mimeType = "audio/webm;codecs=opus",
    audioBitsPerSecond = 128000,
  } = config;

  const tolerance = (duration * tolerancePercentage) / 100;
  const minDuration = Math.max(1, duration - tolerance);
  const maxDuration = duration + tolerance;

  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    audioBlob: null,
    audioUrl: null,
    error: null,
    isSupported:
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTimeout(() => {
      setState((prev) => {
        let error = null;

        if (prev.recordingTime < minDuration) {
          error = `Recording is too short. Minimum duration is ${minDuration} seconds.`;
        } else if (prev.recordingTime > maxDuration) {
          error = `Recording is too long. Maximum duration is ${maxDuration} seconds.`;
        }

        return {
          ...prev,
          error,
        };
      });
    }, 100);
  }, [state.isRecording, minDuration, maxDuration]);

  useEffect(() => {
    if (state.recordingTime >= maxDuration && state.isRecording) {
      stopRecording();
    }
  }, [state.recordingTime, maxDuration, state.isRecording, stopRecording]);

  const startRecording = useCallback(async (): Promise<boolean> => {
    try {
      if (!state.isSupported) {
        setState((prev) => ({
          ...prev,
          error: "Audio recording is not supported in this browser.",
        }));
        return false;
      }

      if (state.audioUrl) {
        URL.revokeObjectURL(state.audioUrl);
      }

      setState((prev) => ({
        ...prev,
        isRecording: false,
        isPaused: false,
        recordingTime: 0,
        audioBlob: null,
        audioUrl: null,
        error: null,
      }));

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });

      mediaStreamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType)
          ? mimeType
          : "audio/webm",
        audioBitsPerSecond,
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        setState((prev) => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false,
          isPaused: false,
        }));

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setState((prev) => ({
          ...prev,
          error: "Recording failed. Please try again.",
          isRecording: false,
          isPaused: false,
        }));
      };

      mediaRecorder.start(1000);

      setState((prev) => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        error: null,
      }));

      timerRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          recordingTime: prev.recordingTime + 1,
        }));
      }, 1000);

      return true;
    } catch (error) {
      console.error("Error starting recording: ", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isRecording: false,
      }));

      return false;
    }
  }, [state.isSupported, state.audioUrl, mimeType, audioBitsPerSecond]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && !state.isPaused) {
      mediaRecorderRef.current.pause();

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setState((prev) => ({
        ...prev,
        isPaused: true,
      }));
    }
  }, [state.isRecording, state.isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && state.isPaused) {
      mediaRecorderRef.current.resume();

      timerRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          recordingTime: prev.recordingTime + 1,
        }));
      }, 1000);

      setState((prev) => ({
        ...prev,
        isPaused: false,
      }));
    }
  }, [state.isRecording, state.isPaused]);

  const clearRecording = useCallback(() => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }

    setState((prev) => ({
      ...prev,
      audioBlob: null,
      audioUrl: null,
      recordingTime: 0,
      error: null,
    }));
  }, [state.audioUrl]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const secs = seconds % 60;
    return `${secs.toString().padStart(2, "0")}`;
  }, []);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }
  }, [state.audioUrl]);

  return {
    isRecording: state.isRecording,
    isPaused: state.isPaused,
    recordingTime: state.recordingTime,
    audioBlob: state.audioBlob,
    audioUrl: state.audioUrl,
    error: state.error,
    isSupported: state.isSupported,

    resourceDuration: duration,
    minDuration,
    maxDuration,

    formattedTime: formatTime(state.recordingTime),
    canRecord: !state.isRecording && state.isSupported,
    canStop: state.isRecording,
    canPause: state.isRecording && state.isPaused,
    hasRecording: !!state.audioBlob,
    isValidDuration:
      state.recordingTime >= minDuration && state.recordingTime <= maxDuration,

    progressPercentage: Math.min((state.recordingTime / duration) * 100, 100),

    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    clearError,
    cleanup,
  };
};
