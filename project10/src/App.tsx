import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ChatHall from "@/pages/ChatHall"
import ChatRoom from "@/pages/ChatRoom"
import NotePeek from "@/pages/NotePeek"
import EvidenceBoard from "@/pages/EvidenceBoard"
import Deduction from "@/pages/Deduction"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatHall />} />
        <Route path="/chat/:characterId" element={<ChatRoom />} />
        <Route path="/notes/:characterId" element={<NotePeek />} />
        <Route path="/evidence" element={<EvidenceBoard />} />
        <Route path="/deduction" element={<Deduction />} />
      </Routes>
    </Router>
  )
}
