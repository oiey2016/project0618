import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { OfflineRewardsModal } from "@/components/game/OfflineRewardsModal";
import { useOfflineRewards } from "@/hooks/useOfflineRewards";
import Home from "@/pages/Home";
import Battle from "@/pages/Battle";
import Equipment from "@/pages/Equipment";
import Shop from "@/pages/Shop";
import Settings from "@/pages/Settings";

function AppContent() {
  const { showModal, rewards, claimRewards, closeModal } = useOfflineRewards();
  
  return (
    <>
      <Layout />
      <OfflineRewardsModal
        isOpen={showModal}
        onClose={closeModal}
        onClaim={claimRewards}
        rewards={rewards}
      />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />}>
          <Route index element={<Home />} />
          <Route path="battle" element={<Battle />} />
          <Route path="equipment" element={<Equipment />} />
          <Route path="shop" element={<Shop />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
