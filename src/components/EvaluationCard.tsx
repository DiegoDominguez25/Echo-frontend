import React, { useState } from "react";
import type { Evaluation } from "@/data/interfaces/UserData";
import {
  FiChevronDown,
  FiZap,
  FiMessageSquare,
  FiBarChart2,
  FiMic,
  FiStar,
} from "react-icons/fi";

interface EvaluationForCard {
  articulation_tip: string[];
  clarity_tip: string[];
  rythm_tip: string[];
  speed_tip: string[];
  articulation_score: number;
  clarity_score: number;
  rythm_score: number;
  speed_score: number;
  total_score: number;
  classification: string;
}
interface EvaluationCardProps {
  evaluation: Evaluation | EvaluationForCard;
  lastAttempt?: string;
}

const ScoreCircle: React.FC<{ label: string; score: number }> = ({
  label,
  score,
}) => (
  <div className="flex flex-col items-center justify-center text-center w-20 h-20 bg-gray-100/60 rounded-full border border-gray-200/80">
    <span className="text-xl font-bold text-gray-800">{score}</span>
    <span className="text-xs text-gray-500 mt-1">{label}</span>
  </div>
);

const NoteSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  tip: string[];
  isOpen: boolean;
  onToggle: () => void;
}> = ({ icon, title, description, tip, isOpen, onToggle }) => (
  <div>
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full text-left"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-semibold text-gray-800">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden md:block text-sm text-gray-400">
          {description}
        </span>
        <FiChevronDown
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
    </button>
    {isOpen && (
      <div className="pl-10 mt-2 space-y-2">
        {" "}
        {tip?.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-600 text-sm">{item}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const EvaluationCard: React.FC<EvaluationCardProps> = ({
  evaluation,
  lastAttempt,
}) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    Speed: true,
  });
  const normalizedTips = "tips" in evaluation ? evaluation.tips : evaluation;
  const handleToggle = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getOverallScoreFeedback = () => {
    if (evaluation.total_score >= 80)
      return { text: "Excellent", color: "text-green-600" };
    if (evaluation.total_score >= 41)
      return { text: "Very Good", color: "text-lime-400" };
    if (evaluation.total_score >= 10)
      return { text: "Good", color: "text-yellow-600" };
    return { text: "Needs Practice", color: "text-red-500" };
  };

  const scoreFeedback = getOverallScoreFeedback();
  const getDayWithSuffix = (day: number) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "long" });
    const dayWithSuffix = getDayWithSuffix(date.getDate());
    const year = date.getFullYear();

    return `${month} ${dayWithSuffix}, ${year}`;
  };

  const formattedDate = formatDate(lastAttempt);
  return (
    <div className="bg-[#8BA1E9]/20 border border-gray-200/80 rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="flex items-center gap-2 text-lg text-[#6786eb]">
          <FiStar /> Evaluation
        </h2>
        <span className="text-sm text-[#6786eb]">{formattedDate}</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 grid md:grid-cols-2 items-center">
        <div className="text-center md:pr-4">
          <p className="text-gray-500 text-sm">Overall Score</p>
          <p className="text-5xl font-bold text-gray-800">
            {evaluation.total_score}
            <span className="text-2xl text-gray-400">/ 100</span>
          </p>
          <p className={`font-semibold ${scoreFeedback.color}`}>
            {scoreFeedback.text}
          </p>
        </div>
        <div>
          <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-4">
              <ScoreCircle label="Speed" score={evaluation.speed_score} />
              <ScoreCircle label="Clarity" score={evaluation.clarity_score} />
            </div>
            <div className="flex gap-4">
              <ScoreCircle label="Tone" score={evaluation.rythm_score} />
              <ScoreCircle
                label="Precision"
                score={evaluation.articulation_score}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <h3 className="font-semibold text-gray-800">Automatic Feedback</h3>
        <NoteSection
          icon={<FiZap className="text-red-500" />}
          title="Speed"
          description="How well paced are you?"
          tip={normalizedTips.speed_tip ?? []}
          isOpen={!!openSections["Speed"]}
          onToggle={() => handleToggle("Speed")}
        />
        <NoteSection
          icon={<FiMessageSquare className="text-yellow-500" />}
          title="Clarity"
          description="How understandable are you?"
          tip={normalizedTips.clarity_tip ?? []}
          isOpen={!!openSections["Clarity"]}
          onToggle={() => handleToggle("Clarity")}
        />
        <NoteSection
          icon={<FiBarChart2 className="text-blue-500" />}
          title="Rythm"
          description="Does your intonation match?"
          tip={normalizedTips.rythm_tip ?? []}
          isOpen={!!openSections["Rythm"]}
          onToggle={() => handleToggle("Rythm")}
        />
        <NoteSection
          icon={<FiMic className="text-purple-500" />}
          title="Articulation"
          description="How good is your accent?"
          tip={normalizedTips.articulation_tip ?? []}
          isOpen={!!openSections["Articulation"]}
          onToggle={() => handleToggle("Articulation")}
        />
      </div>
    </div>
  );
};

export default EvaluationCard;
