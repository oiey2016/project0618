import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { StartScreen } from "@/pages/StartScreen";
import { LevelSelect } from "@/pages/LevelSelect";
import { GameScene } from "@/pages/GameScene";

export default function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/levels" element={<LevelSelect />} />
          <Route path="/game/:levelId" element={<GameScene />} />
          <Route path="*" element={<StartScreen />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}
