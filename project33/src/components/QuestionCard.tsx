import { Country } from "@/data/countries";
import { HelpCircle, Clock } from "lucide-react";

interface QuestionCardProps {
  country: Country;
  questionType: "country" | "capital";
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  country,
  questionType,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-game p-6 animate-pop border-4 border-accent-yellow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-accent-yellow/20 flex items-center justify-center">
            <HelpCircle size={20} className="text-accent-yellow" />
          </div>
          <span className="text-sm font-bold text-gray-500">
            第 {questionNumber} / {totalQuestions} 题
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-primary-500" />
          <span className="text-sm font-bold text-primary-500">加油!</span>
        </div>
      </div>

      <div className="text-center">
        {questionType === "country" ? (
          <>
            <p className="text-lg text-gray-500 mb-2">请在地图上点击</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl">{country.flag}</span>
              <h2 className="text-3xl font-bold text-gray-800 font-game">
                {country.name}
              </h2>
            </div>
            <p className="text-sm text-gray-400 mt-2">的位置</p>
          </>
        ) : (
          <>
            <p className="text-lg text-gray-500 mb-2">首都是</p>
            <h2 className="text-3xl font-bold text-accent-orange font-game mb-2">
              {country.capital}
            </h2>
            <p className="text-lg text-gray-500">的国家是哪个？</p>
            <div className="mt-4 flex justify-center">
              <span className="text-4xl animate-bounce-slow">🤔</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-green to-primary-500 transition-all duration-500"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>
    </div>
  );
}
