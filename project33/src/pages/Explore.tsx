import { useState } from "react";
import NavBar from "@/components/NavBar";
import WorldMap from "@/components/WorldMap";
import CountryCard from "@/components/CountryCard";
import { Country } from "@/data/countries";

export default function Explore() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleCloseCard = () => {
    setSelectedCountry(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-cream">
      <div className="container mx-auto px-4 py-6">
        <NavBar title="🗺️ 探索模式" />

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-4 shadow-card">
              <div className="h-[500px]">
                <WorldMap
                  onCountryClick={handleCountryClick}
                  selectedCountryId={selectedCountry?.id || null}
                  interactive={true}
                />
              </div>
            </div>

            <div className="mt-4 text-center text-gray-500 text-sm">
              💡 提示：点击地图上的彩色圆点，就能了解这个国家的信息哦！
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedCountry ? (
              <div className="animate-slide-in-right">
                <CountryCard country={selectedCountry} onClose={handleCloseCard} />

                <div className="mt-4 bg-white rounded-2xl p-4 shadow-card">
                  <h4 className="font-bold text-gray-700 mb-2">📚 小知识</h4>
                  <p className="text-sm text-gray-500">
                    {selectedCountry.name}是{selectedCountry.continent}的一个美丽国家，
                    首都是{selectedCountry.capital}。每个国家都有自己独特的文化和风景哦！
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-card text-center h-[400px] flex flex-col items-center justify-center">
                <div className="text-6xl mb-4 animate-float">👆</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2 font-game">
                  点击地图开始探索！
                </h3>
                <p className="text-gray-500 text-sm">
                  选择一个国家，<br />
                  了解它的名字和首都~
                </p>

                <div className="mt-6 grid grid-cols-4 gap-2">
                  {["🇨🇳", "🇺🇸", "🇯🇵", "🇬🇧", "🇫🇷", "🇷🇺", "🇦🇺", "🇧🇷"].map((flag, i) => (
                    <div
                      key={i}
                      className="text-2xl animate-bounce-slow"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {flag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
