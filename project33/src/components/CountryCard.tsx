import { Country } from "@/data/countries";
import { X, Flag, Globe, MapPin } from "lucide-react";

interface CountryCardProps {
  country: Country;
  onClose?: () => void;
}

export default function CountryCard({ country, onClose }: CountryCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-game overflow-hidden animate-pop border-4 border-white">
      <div
        className="h-24 relative flex items-center justify-center"
        style={{ backgroundColor: country.color + "20" }}
      >
        <span className="text-6xl animate-float">{country.flag}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors shadow-md"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-2xl font-bold text-gray-800 mb-3 font-game">
          {country.name}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-sand/50 rounded-xl p-3">
            <div className="w-10 h-10 rounded-full bg-accent-orange/20 flex items-center justify-center">
              <Flag size={20} className="text-accent-orange" />
            </div>
            <div>
              <p className="text-xs text-gray-500">首都</p>
              <p className="font-bold text-gray-800">{country.capital}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-sand/50 rounded-xl p-3">
            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
              <Globe size={20} className="text-primary-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">所属大洲</p>
              <p className="font-bold text-gray-800">{country.continent}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-sand/50 rounded-xl p-3">
            <div className="w-10 h-10 rounded-full bg-accent-green/20 flex items-center justify-center">
              <MapPin size={20} className="text-accent-green" />
            </div>
            <div>
              <p className="text-xs text-gray-500">位置</p>
              <p className="font-bold text-gray-800">{country.continent}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
