import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "@/pages/MainMenu";
import GameScreen from "@/pages/GameScreen";
import EndingScreen from "@/pages/EndingScreen";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/ending" element={<EndingScreen />} />
      </Routes>
    </Router>
  );
}
