import { CgTranscript } from "react-icons/cg";

const TranscriptView = ({ transcript }: { transcript?: string }) => {
  return (
    <div className="bg-gray-100 p-4 pb-30 rounded-lg shadow-md border border-gray-200 mt-4">
      <div className="flex items-center gap-2 text-gray-600 font-medium text-sm mb-3">
        <CgTranscript />
        <span>Transcript</span>
      </div>

      {transcript ? (
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
          <p className="text-gray-800 font-medium">{transcript}</p>
        </div>
      ) : (
        <div className="flex items-center justify-start h-10">
          <p className="text-gray-500 italic text-sm">
            Submit your audio to see its transcription.
          </p>
        </div>
      )}
    </div>
  );
};

export default TranscriptView;
