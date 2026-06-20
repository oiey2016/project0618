import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { PUZZLES, ITEMS } from '../../game/gameData';
import { X, Gem, Key } from 'lucide-react';

export default function PuzzleModal() {
  const activePuzzleId = useGameStore((s) => s.activePuzzleId);
  const closePuzzle = useGameStore((s) => s.closePuzzle);
  const solvePuzzle = useGameStore((s) => s.solvePuzzle);
  const checkPuzzleSolution = useGameStore((s) => s.checkPuzzleSolution);
  const showDialog = useGameStore((s) => s.showDialog);
  const collectedItems = useGameStore((s) => s.collectedItems);

  const [codeInput, setCodeInput] = useState('');
  const [gemSequence, setGemSequence] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!activePuzzleId) return null;

  const puzzle = PUZZLES[activePuzzleId];
  if (!puzzle) return null;

  const handleClose = () => {
    setCodeInput('');
    setGemSequence([]);
    setError('');
    setSuccess(false);
    closePuzzle();
  };

  const handleCodeSubmit = () => {
    if (checkPuzzleSolution(activePuzzleId, codeInput)) {
      setSuccess(true);
      setError('');
      solvePuzzle(activePuzzleId);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } else {
      setError('密码错误，再试试！');
      setCodeInput('');
    }
  };

  const handleGemClick = (gemColor: string) => {
    if (gemSequence.length >= 2) return;
    const newSequence = [...gemSequence, gemColor];
    setGemSequence(newSequence);
    setError('');

    if (newSequence.length === 2) {
      const sequenceStr = newSequence.join('-');
      if (checkPuzzleSolution(activePuzzleId, sequenceStr)) {
        setSuccess(true);
        solvePuzzle(activePuzzleId);
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError('顺序不对，宝石弹了回去...');
        setTimeout(() => {
          setGemSequence([]);
          setError('');
        }, 1000);
      }
    }
  };

  const hasRedGem = collectedItems.includes('gem_red');
  const hasBlueGem = collectedItems.includes('gem_blue');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div 
        className="relative w-full max-w-md transform transition-all"
        style={{
          animation: 'zoomIn 0.3s ease-out',
        }}
      >
        <div 
          className="rounded-xl p-6 shadow-2xl"
          style={{
            background: 'linear-gradient(180deg, #4A3D5C 0%, #2D2540 100%)',
            border: '4px solid #6B5D8B',
            boxShadow: '0 0 50px rgba(100, 80, 150, 0.4), inset 0 2px 4px rgba(255,255,255,0.1)',
          }}
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 rounded-full text-purple-200 hover:bg-purple-500/30 transition-colors"
          >
            <X size={24} />
          </button>

          <h2 
            className="text-2xl font-bold text-amber-200 mb-2 text-center"
            style={{ textShadow: '0 0 10px rgba(255, 200, 100, 0.3)' }}
          >
            🔮 {puzzle.title}
          </h2>
          
          <p className="text-purple-200 text-center mb-6 text-sm">
            {puzzle.description}
          </p>

          {success ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4" style={{ animation: 'bounce 0.5s ease-in-out' }}>✨</div>
              <p className="text-2xl text-green-300 font-bold">谜题解开了！</p>
              {puzzle.rewardItemId && ITEMS[puzzle.rewardItemId] && (
                <p className="text-amber-300 mt-2">
                  获得：{ITEMS[puzzle.rewardItemId].name}
                </p>
              )}
            </div>
          ) : (
            <>
              {puzzle.type === 'code' && (
                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-16 h-20 flex items-center justify-center text-3xl font-bold rounded-lg"
                        style={{
                          background: 'linear-gradient(180deg, #1A1525 0%, #0D0A15 100%)',
                          border: '3px solid #4A3D5C',
                          color: codeInput[i] ? '#90EE90' : '#666',
                          fontFamily: 'monospace',
                          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
                        }}
                      >
                        {codeInput[i] || '?'}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((num, i) => (
                      <button
                        key={i}
                        disabled={num === null}
                        onClick={() => {
                          if (num === 'del') {
                            setCodeInput((p) => p.slice(0, -1));
                          } else if (num !== null && codeInput.length < 3) {
                            setCodeInput((p) => p + num);
                          }
                        }}
                        className="h-12 rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95 disabled:invisible"
                        style={{
                          background: num === 'del'
                            ? 'linear-gradient(180deg, #8B3A3A 0%, #5C1A1A 100%)'
                            : 'linear-gradient(180deg, #6B5D8B 0%, #4A3D6C 100%)',
                          border: '2px solid #8B7DA5',
                          color: '#E0D5F0',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                      >
                        {num === 'del' ? '←' : num}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleCodeSubmit}
                      disabled={codeInput.length !== 3}
                      className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                      style={{
                        background: 'linear-gradient(180deg, #DAA520 0%, #B8860B 100%)',
                        border: '3px solid #FFD700',
                        color: '#2D1F00',
                        boxShadow: '0 4px 12px rgba(218, 165, 32, 0.4)',
                      }}
                    >
                      确认
                    </button>
                  </div>
                </div>
              )}

              {puzzle.type === 'sequence' && (
                <div className="space-y-6">
                  <div className="flex justify-center gap-4">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="w-16 h-16 flex items-center justify-center rounded-full"
                        style={{
                          background: gemSequence[i]
                            ? gemSequence[i] === 'red'
                              ? 'radial-gradient(circle, #DC143C 0%, #8B0000 100%)'
                              : 'radial-gradient(circle, #4169E1 0%, #00008B 100%)'
                            : 'rgba(255,255,255,0.1)',
                          border: '3px solid #6B5D8B',
                          boxShadow: gemSequence[i]
                            ? `0 0 20px ${gemSequence[i] === 'red' ? 'rgba(220, 20, 60, 0.6)' : 'rgba(65, 105, 225, 0.6)'}`
                            : 'none',
                        }}
                      >
                        {gemSequence[i] ? (
                          <Gem size={28} fill="white" stroke="white" />
                        ) : (
                          <span className="text-purple-400 text-2xl">?</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-6">
                    <button
                      onClick={() => handleGemClick('red')}
                      disabled={!hasRedGem || gemSequence.includes('red')}
                      className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
                      style={{
                        background: 'radial-gradient(circle, #DC143C 0%, #8B0000 100%)',
                        border: '4px solid #FF6B6B',
                        boxShadow: '0 0 20px rgba(220, 20, 60, 0.5)',
                      }}
                      title={hasRedGem ? '红宝石' : '尚未获得红宝石'}
                    >
                      <Gem size={36} fill="white" stroke="white" />
                    </button>
                    
                    <button
                      onClick={() => handleGemClick('blue')}
                      disabled={!hasBlueGem || gemSequence.includes('blue')}
                      className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
                      style={{
                        background: 'radial-gradient(circle, #4169E1 0%, #00008B 100%)',
                        border: '4px solid #6495ED',
                        boxShadow: '0 0 20px rgba(65, 105, 225, 0.5)',
                      }}
                      title={hasBlueGem ? '蓝宝石' : '尚未获得蓝宝石'}
                    >
                      <Gem size={36} fill="white" stroke="white" />
                    </button>
                  </div>

                  {!hasRedGem || !hasBlueGem ? (
                    <p className="text-center text-purple-300 text-sm">
                      💡 你需要收集两颗宝石才能解开这个谜题
                    </p>
                  ) : (
                    <p className="text-center text-purple-300 text-sm">
                      💡 按正确的顺序点击宝石放入凹槽
                    </p>
                  )}

                  {gemSequence.length > 0 && gemSequence.length < 2 && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setGemSequence([])}
                        className="text-purple-300 text-sm hover:text-purple-100 underline"
                      >
                        重置
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {error && (
            <p 
              className="text-center text-red-400 mt-4 text-sm"
              style={{ animation: 'shake 0.3s ease-in-out' }}
            >
              ❌ {error}
            </p>
          )}

          <div className="mt-6 pt-4 border-t border-purple-500/30">
            <p className="text-purple-300 text-xs text-center italic">
              💭 提示：{puzzle.hint}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
