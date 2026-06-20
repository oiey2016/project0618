import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import GamePage from "@/pages/GamePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:levelId" element={<GamePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
