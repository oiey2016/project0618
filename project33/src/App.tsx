import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Challenge from "@/pages/Challenge";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/challenge" element={<Challenge />} />
      </Routes>
    </Router>
  );
}
