import daily_life from "@/assets/images/daily_life.png";
import education from "@/assets/images/education.png";
import health from "@/assets/images/health.png";
import work from "@/assets/images/work.png";
import travel from "@/assets/images/travel.png";
import social_life from "@/assets/images/social_life.png";
import { FiBarChart, FiTrendingUp, FiAward } from "react-icons/fi";

export const resourceTypes = [
  { value: "words", label: "Words" },
  { value: "sentences", label: "Sentences" },
  { value: "texts", label: "Texts" },
];

export const difficultyLevels = [
  { value: "0", label: "Easy" },
  { value: "1", label: "Intermediate" },
  { value: "2", label: "Difficult" },
];

export const categoryImages: Record<string, string> = {
  "daily life": daily_life,
  education: education,
  health: health,
  work: work,
  travel: travel,
  "social life": social_life,
};

export const backgroundColors: Record<string, string> = {
  "daily life": "bg-[#D8E3FF]",
  work: "bg-[#EDD5D5]",
  "social life": "bg-[#EFECAE]",
  education: "bg-[#D2F2E4]",
  travel: "bg-[#D8E3FF]",
  health: "bg-[#EDD5D5]",
};

export const ITEMS_PER_PAGE = 10;

export const levelConfig = {
  Beginner: {
    title: "beginner",
    description:
      "The user has difficulty communicating clearly and using grammar correctly. The user frequently hesitates and pauses during conversations, which affects the coherence of the message. Requires considerable improvement.",
    icon: <FiBarChart className="h-6 w-6" />,
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-300",
  },
  Intermediate: {
    title: "intermediate",
    description:
      "The user manages to convey meaning in conversations, although they make moderate errors. The user handles communication with some pauses or hesitation. The user can maintain interaction and make themselves understood in most situations.",
    icon: <FiTrendingUp className="h-6 w-6" />,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
  },
  Advanced: {
    title: "advanced",
    description:
      "The user communicates clearly and fluently, using grammar appropriately. The user maintains a natural rhythm in conversation, with few pauses, and links ideas coherently. The user shows a good command of the language.",
    icon: <FiAward className="h-6 w-6" />,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-300",
  },
};

export const tagColors = [
  {
    bg: "bg-indigo-50",
    border: "border-indigo-300",
    text: "text-indigo-800",
  },
  { bg: "bg-pink-50", border: "border-pink-300", text: "text-pink-800" },
  { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-800" },
];
