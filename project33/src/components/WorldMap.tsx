import { useState } from "react";
import { countries, Country } from "@/data/countries";

interface WorldMapProps {
  onCountryClick?: (country: Country) => void;
  selectedCountryId?: string | null;
  highlightCountryId?: string | null;
  feedbackState?: "correct" | "wrong" | null;
  interactive?: boolean;
}

export default function WorldMap({
  onCountryClick,
  selectedCountryId,
  highlightCountryId,
  feedbackState,
  interactive = true,
}: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const handleCountryClick = (country: Country) => {
    if (interactive && onCountryClick) {
      onCountryClick(country);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-3xl overflow-hidden bg-gradient-to-b from-sky-200 via-sky-300 to-blue-400 shadow-game">
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="50%" stopColor="#5DADE2" />
            <stop offset="100%" stopColor="#3498DB" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow dx="0" dy="0.3" stdDeviation="0.3" floodOpacity="0.3" />
          </filter>
        </defs>

        <rect width="100" height="60" fill="url(#oceanGradient)" />

        <g opacity="0.3">
          <ellipse cx="15" cy="15" rx="8" ry="5" fill="white" />
          <ellipse cx="20" cy="12" rx="6" ry="4" fill="white" />
          <ellipse cx="75" cy="10" rx="10" ry="6" fill="white" />
          <ellipse cx="85" cy="14" rx="7" ry="4" fill="white" />
          <ellipse cx="50" cy="8" rx="8" ry="5" fill="white" />
        </g>

        <g className="continents" opacity="0.6">
          <path
            d="M20,20 Q25,18 30,20 L35,25 Q38,30 35,35 L30,38 Q25,40 20,38 L15,35 Q12,30 15,25 Z"
            fill="#7CB342"
            filter="url(#shadow)"
          />
          <path
            d="M40,22 Q48,20 55,22 L58,28 Q60,32 58,36 L55,40 Q50,42 45,40 L42,36 Q40,32 42,28 Z"
            fill="#8BC34A"
            filter="url(#shadow)"
          />
          <path
            d="M55,15 Q65,12 75,15 L80,20 Q82,25 80,30 L75,33 Q70,35 65,33 L60,30 Q58,25 60,20 Z"
            fill="#7CB342"
            filter="url(#shadow)"
          />
          <path
            d="M10,40 Q15,38 20,40 L22,45 Q23,50 22,55 L20,58 Q18,60 15,58 L12,55 Q10,50 10,45 Z"
            fill="#8BC34A"
            filter="url(#shadow)"
          />
          <path
            d="M45,42 Q52,40 58,42 L60,48 Q61,54 58,60 L52,62 Q48,60 45,58 L43,52 Q42,47 43,45 Z"
            fill="#7CB342"
            filter="url(#shadow)"
          />
          <path
            d="M75,45 Q82,43 88,45 L90,50 Q91,55 88,58 L82,60 Q78,58 75,56 L73,52 Q72,48 73,47 Z"
            fill="#8BC34A"
            filter="url(#shadow)"
          />
        </g>

        {countries.map((country) => {
          const isSelected = selectedCountryId === country.id;
          const isHighlighted = highlightCountryId === country.id;
          const isHovered = hoveredCountry === country.id;
          const showFeedback = feedbackState && isSelected;

          return (
            <g
              key={country.id}
              onClick={() => handleCountryClick(country)}
              onMouseEnter={() => setHoveredCountry(country.id)}
              onMouseLeave={() => setHoveredCountry(null)}
              className={interactive ? "cursor-pointer" : "cursor-default"}
              style={{
                transform: `translate(${country.x}px, ${country.y}px)`,
                transition: "transform 0.2s ease",
              }}
            >
              <circle
                r={
                  (country.size / 10) *
                  (isSelected || isHovered ? 1.3 : 1)
                }
                fill={country.color}
                stroke={isSelected ? "white" : "rgba(255,255,255,0.5)"}
                strokeWidth={isSelected ? 2 : 1}
                filter={isSelected || isHighlighted ? "url(#glow)" : "url(#shadow)"}
                className={
                  showFeedback && feedbackState === "correct"
                    ? "animate-pulse"
                    : showFeedback && feedbackState === "wrong"
                    ? "animate-shake"
                    : ""
                }
                style={{
                  transition: "all 0.2s ease",
                  opacity: interactive ? 1 : 0.7,
                }}
              />

              {(isHovered || isSelected) && (
                <text
                  textAnchor="middle"
                  dy={-country.size / 10 - 4}
                  className="text-[3px] font-bold fill-white"
                  style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.5)", strokeWidth: 0.3 }}
                >
                  {country.flag} {country.name}
                </text>
              )}

              {showFeedback && feedbackState === "correct" && (
                <g>
                  <text
                    textAnchor="middle"
                    dy={-country.size / 10 - 8}
                    className="text-[4px] animate-bounce"
                  >
                    ⭐
                  </text>
                  <text
                    textAnchor="middle"
                    dy={2}
                    className="text-[3px] font-bold fill-white"
                    style={{ paintOrder: "stroke", stroke: "#22c55e", strokeWidth: 0.8 }}
                  >
                    ✓
                  </text>
                </g>
              )}

              {showFeedback && feedbackState === "wrong" && (
                <text
                  textAnchor="middle"
                  dy={2}
                  className="text-[4px] font-bold fill-white"
                  style={{ paintOrder: "stroke", stroke: "#ef4444", strokeWidth: 1 }}
                >
                  ✗
                </text>
              )}
            </g>
          );
        })}

        {highlightCountryId && (
          <circle
            cx={countries.find((c) => c.id === highlightCountryId)?.x || 0}
            cy={countries.find((c) => c.id === highlightCountryId)?.y || 0}
            r={(countries.find((c) => c.id === highlightCountryId)?.size || 20) / 8}
            fill="none"
            stroke="#FFD93D"
            strokeWidth="2"
            opacity="0.8"
            className="animate-pulse"
          />
        )}
      </svg>

      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-card">
        <span className="text-xs font-medium text-gray-600">🌍 点击国家探索</span>
      </div>
    </div>
  );
}
