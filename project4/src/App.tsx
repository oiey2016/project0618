import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import RestaurantPage from "@/pages/RestaurantPage";
import MenuPage from "@/pages/MenuPage";
import CatsPage from "@/pages/CatsPage";
import DecorPage from "@/pages/DecorPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
        <TopBar />
        <Routes>
          <Route path="/" element={<RestaurantPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cats" element={<CatsPage />} />
          <Route path="/decor" element={<DecorPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
