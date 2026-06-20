import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPage from '@/pages/MenuPage';
import MapPage from '@/pages/MapPage';
import QuizPage from '@/pages/QuizPage';
import ShopPage from '@/pages/ShopPage';
import InventoryPage from '@/pages/InventoryPage';
import ResultPage from '@/pages/ResultPage';
import GuidePage from '@/pages/GuidePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/quiz/:levelId" element={<QuizPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/result/:levelId" element={<ResultPage />} />
        <Route path="/guide" element={<GuidePage />} />
      </Routes>
    </Router>
  );
}
