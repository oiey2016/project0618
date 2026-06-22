import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import GamePage from '@/pages/GamePage';
import ResultPage from '@/pages/ResultPage';

export default function App() {
  return (
    <Router>
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:songId" element={<GamePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}
