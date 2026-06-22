import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Smartphone, Smartphone as SmartphoneOff, Save, RotateCcw, Download, Upload, Info } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { formatNumber } from '../utils/formatter';
import { exportSave, importSave } from '../utils/storage';

export default function SettingsPage() {
  const {
    settings,
    toggleSound,
    toggleVibration,
    saveGame,
    resetGame,
    player,
    gold,
    gems,
    monstersKilled,
    highestStage,
  } = useGameStore();
  
  const [showResetModal, setShowResetModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportText, setExportText] = useState('');
  
  const handleExport = () => {
    const saveData = exportSave();
    setExportText(saveData);
    setShowExportModal(true);
  };
  
  const handleImport = () => {
    if (!importText.trim()) return;
    
    const success = importSave(importText.trim());
    if (success) {
      setShowImportModal(false);
      setImportText('');
      window.location.reload();
    } else {
      alert('导入失败，请检查存档数据是否正确');
    }
  };
  
  const handleReset = () => {
    resetGame();
    setShowResetModal(false);
    window.location.reload();
  };
  
  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportText);
    alert('存档已复制到剪贴板！');
  };
  
  return (
    <div className="space-y-4">
      <Card gradient>
        <h2 className="font-display text-xl font-bold text-coffee-600 mb-4 flex items-center gap-2">
          ⚙️ 游戏设置
        </h2>
        
        <div className="space-y-3">
          <button
            onClick={toggleSound}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl hover:bg-cream-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-6 h-6 text-mint-500" />
              ) : (
                <VolumeX className="w-6 h-6 text-coffee-300" />
              )}
              <span className="font-bold text-coffee-600">音效</span>
            </div>
            <div className={`w-12 h-7 rounded-full transition-colors ${
              settings.soundEnabled ? 'bg-mint-400' : 'bg-cream-300'
            }`}>
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: settings.soundEnabled ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </button>
          
          <button
            onClick={toggleVibration}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl hover:bg-cream-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {settings.vibrationEnabled ? (
                <Smartphone className="w-6 h-6 text-coral-500" />
              ) : (
                <SmartphoneOff className="w-6 h-6 text-coffee-300" />
              )}
              <span className="font-bold text-coffee-600">震动反馈</span>
            </div>
            <div className={`w-12 h-7 rounded-full transition-colors ${
              settings.vibrationEnabled ? 'bg-coral-400' : 'bg-cream-300'
            }`}>
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: settings.vibrationEnabled ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </button>
        </div>
      </Card>
      
      <Card>
        <h3 className="font-bold text-coffee-600 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-lavender-500" />
          游戏数据
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-mint-50 rounded-xl text-center">
            <p className="text-xs text-coffee-400">当前等级</p>
            <p className="font-mono font-bold text-xl text-coffee-600">Lv.{player.level}</p>
          </div>
          <div className="p-3 bg-coral-50 rounded-xl text-center">
            <p className="text-xs text-coffee-400">拥有金币</p>
            <p className="font-mono font-bold text-xl text-yellow-600">{formatNumber(gold)}</p>
          </div>
          <div className="p-3 bg-lavender-100 rounded-xl text-center">
            <p className="text-xs text-coffee-400">拥有钻石</p>
            <p className="font-mono font-bold text-xl text-lavender-500">{formatNumber(gems)}</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-xl text-center">
            <p className="text-xs text-coffee-400">击杀怪物</p>
            <p className="font-mono font-bold text-xl text-coffee-600">{formatNumber(monstersKilled)}</p>
          </div>
          <div className="p-3 bg-mint-50 rounded-xl text-center col-span-2">
            <p className="text-xs text-coffee-400">最高层数</p>
            <p className="font-mono font-bold text-xl text-mint-600">第 {highestStage} 层</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <h3 className="font-bold text-coffee-600 mb-3 flex items-center gap-2">
          💾 存档管理
        </h3>
        <div className="space-y-3">
          <Button
            fullWidth
            variant="ghost"
            onClick={saveGame}
            className="flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            手动保存
          </Button>
          
          <Button
            fullWidth
            variant="ghost"
            onClick={handleExport}
            className="flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            导出存档
          </Button>
          
          <Button
            fullWidth
            variant="ghost"
            onClick={() => setShowImportModal(true)}
            className="flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            导入存档
          </Button>
          
          <Button
            fullWidth
            variant="danger"
            onClick={() => setShowResetModal(true)}
            className="flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重置游戏
          </Button>
        </div>
      </Card>
      
      <Card>
        <div className="text-center text-coffee-400 text-sm">
          <p className="mb-1">🌟 星落小镇</p>
          <p className="text-xs">版本 1.0.0</p>
          <p className="text-xs mt-2">享受轻松的放置冒险时光！</p>
        </div>
      </Card>
      
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="确认重置"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <RotateCcw className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-coffee-600 mb-2">确定要重置游戏吗？</p>
          <p className="text-sm text-coffee-400 mb-6">所有进度将会丢失，此操作不可撤销！</p>
          <div className="flex gap-3">
            <Button
              fullWidth
              variant="ghost"
              onClick={() => setShowResetModal(false)}
            >
              取消
            </Button>
            <Button
              fullWidth
              variant="danger"
              onClick={handleReset}
            >
              确认重置
            </Button>
          </div>
        </div>
      </Modal>
      
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="导出存档"
      >
        <div>
          <p className="text-sm text-coffee-400 mb-3">
            复制下方的存档数据，粘贴到其他设备即可恢复游戏进度。
          </p>
          <textarea
            readOnly
            value={exportText}
            className="w-full h-32 p-3 bg-cream-50 rounded-xl text-xs font-mono text-coffee-500 resize-none focus:outline-none"
          />
          <Button
            fullWidth
            onClick={handleCopyExport}
            className="mt-3"
          >
            复制到剪贴板
          </Button>
        </div>
      </Modal>
      
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="导入存档"
      >
        <div>
          <p className="text-sm text-coffee-400 mb-3">
            粘贴之前导出的存档数据，点击确认即可恢复。
          </p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="在此粘贴存档数据..."
            className="w-full h-32 p-3 bg-cream-50 rounded-xl text-xs font-mono text-coffee-500 resize-none focus:outline-none focus:ring-2 focus:ring-mint-300"
          />
          <div className="flex gap-3 mt-3">
            <Button
              fullWidth
              variant="ghost"
              onClick={() => setShowImportModal(false)}
            >
              取消
            </Button>
            <Button
              fullWidth
              onClick={handleImport}
              disabled={!importText.trim()}
            >
              确认导入
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
