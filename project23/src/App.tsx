import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import GamePage from "@/pages/GamePage";
import LevelSelect from "@/pages/LevelSelect";
import HelpPage from "@/pages/HelpPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:levelId" element={<GamePage />} />
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </Router>
  );
}
