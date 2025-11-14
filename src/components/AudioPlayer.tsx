import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import { FaPause, FaPlay } from "react-icons/fa";

interface AudioPlayerProps {
  src: string;
  waveColor: string;
  progressColor: string;
}

const AudioPlayer = ({ src, waveColor, progressColor }: AudioPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const initializeWaveSurfer = useCallback(
    (container: HTMLDivElement) => {
      if (wavesurferRef.current) return;

      setIsLoading(true);
      setError(null);
      setCurrentTime(0);

      const ws = WaveSurfer.create({
        container,
        waveColor: `${waveColor}`,
        progressColor: `${progressColor}`,
        height: 50,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
      });
      wavesurferRef.current = ws;

      ws.on("ready", () => {
        setDuration(ws.getDuration());
        setIsLoading(false);
      });
      ws.on("error", (err) => {
        console.error("WaveSurfer error:", err);
        setError("Error al cargar el audio.");
        setIsLoading(false);
      });
      ws.on("play", () => setIsPlaying(true));
      ws.on("pause", () => setIsPlaying(false));
      ws.on("finish", () => {
        setIsPlaying(false);
        ws.seekTo(0);
      });
      ws.on("timeupdate", (time) => setCurrentTime(time));

      ws.load(src);
    },
    [src, waveColor, progressColor]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    observerRef.current = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect.width > 0) {
        initializeWaveSurfer(container);

        observerRef.current?.disconnect();
      }
    });

    observerRef.current.observe(container);

    return () => {
      observerRef.current?.disconnect();
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
    };
  }, [src, initializeWaveSurfer]);

  const togglePlayPause = () => wavesurferRef.current?.playPause();
  const handleSpeedChange = (speed: number) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(speed);
      setPlaybackRate(speed);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-3 rounded-lg flex items-center gap-3 w-full mt-4">
      <button
        onClick={togglePlayPause}
        disabled={isLoading || !!error}
        className="text-[#5575DE] w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-blue-700 hover:text-white transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isPlaying ? <FaPause size={22} /> : <FaPlay size={22} />}
      </button>

      <div ref={containerRef} className="flex-1 h-14 w-full relative">
        {(isLoading || error) && (
          <div className="absolute inset-0 flex items-center justify-center">
            {isLoading && (
              <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            )}
            {error && (
              <div className="text-xs text-red-500 font-semibold">{error}</div>
            )}
          </div>
        )}
      </div>

      <span className="text-sm font-mono text-gray-500 w-24 text-right">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      <div className="flex items-center gap-3">
        {[1.0, 1.5, 2.0].map((speed) => (
          <button
            key={speed}
            onClick={() => handleSpeedChange(speed)}
            disabled={isLoading || !!error}
            className={`px-4 py-1 text-xs font-semibold rounded-lg disabled:opacity-50 ${
              playbackRate === speed
                ? "bg-red-100 text-red-700"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {speed.toFixed(1)}x
          </button>
        ))}
      </div>
    </div>
  );
};

export default AudioPlayer;
