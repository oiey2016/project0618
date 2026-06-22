import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import SelectPage from "@/pages/SelectPage";
import PlayPage from "@/pages/PlayPage";
import ResultPage from "@/pages/ResultPage";
import { useSaveStore } from "@/store/saveStore";
import { useEffect } from "react";

function AppInner() {
  const initialize = useSaveStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/select" element={<SelectPage />} />
      <Route path="/play/:songId" element={<PlayPage />} />
      <Route path="/result/:songId" element={<ResultPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
