import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { STORY_NODES } from '../data/story';
import { MessageNode, ChoiceNode, EndingNode, ChoiceOption } from '../types';

const findNode = (id: string) => STORY_NODES.find((n) => n.id === id);

const processedNodes = new Set<string>();
let timerHandle: number | null = null;
let activeNodeId: string | null = null;

const clearTimer = () => {
  if (timerHandle !== null) {
    window.clearTimeout(timerHandle);
    timerHandle = null;
  }
};

const runMessageNode = (node: MessageNode) => {
  if (processedNodes.has(node.id)) return;
  processedNodes.add(node.id);
  activeNodeId = node.id;

  const state = useGameStore.getState();
  state.setTyping(true);
  let idx = 0;

  const sendNext = () => {
    if (activeNodeId !== node.id) return;
    const s = useGameStore.getState();
    if (idx >= node.messages.length) {
      s.setTyping(false);
      if (node.effects) s.applyEffects(node.effects);
      if (node.giveItem) s.addItem(node.giveItem);

      if (node.nextNodeId) {
        const delay = node.delay ?? 1500;
        timerHandle = window.setTimeout(() => {
          if (activeNodeId === node.id) {
            s.setCurrentNode(node.nextNodeId!);
          }
        }, delay);
      }
      return;
    }
    const msg = node.messages[idx];
    s.setTyping(true);
    const typingDelay = msg.type === 'voice' ? 1200 : Math.min(400 + msg.content.length * 40, 2000);
    timerHandle = window.setTimeout(() => {
      if (activeNodeId !== node.id) return;
      s.addMessage(msg);
      s.setTyping(false);
      idx++;
      timerHandle = window.setTimeout(sendNext, 600);
    }, typingDelay);
  };

  timerHandle = window.setTimeout(sendNext, 800);
};

const runChoiceNode = (node: ChoiceNode) => {
  if (processedNodes.has(node.id)) return;
  processedNodes.add(node.id);
  activeNodeId = node.id;
  const s = useGameStore.getState();
  s.setAwaitingChoice(true);
  s.addMessage({ sender: 'system', type: 'text', content: `【选择】${node.prompt}` });
};

const runEndingNode = (node: EndingNode) => {
  if (processedNodes.has(node.id)) return;
  processedNodes.add(node.id);
  activeNodeId = node.id;

  const s = useGameStore.getState();
  const { health, hunger, trust } = s;

  let finalTitle = node.title;
  let finalDesc = node.description;

  if (node.id === 'ending_calc') {
    const avg = (health + hunger + trust) / 3;
    if (avg >= 70 && trust >= 60) {
      finalTitle = '通往黎明的路';
      finalDesc = `雨停了，远处的霓虹透过云层洒下微光。零靠在警察局门口的墙上，对着通讯器微笑。\n\n"我们做到了...以后我可以经常联系你吗？"\n\n生命值: ${health} | 饱食度: ${hunger} | 信任度: ${trust}\n\n——完美结局——`;
    } else if (avg >= 45) {
      finalTitle = '霓虹下的告别';
      finalDesc = `警笛声响彻街道，零被送上了救护车。她在车窗边对着通讯器挥了挥手。\n\n"谢谢...我会记得你的。"\n\n生命值: ${health} | 饱食度: ${hunger} | 信任度: ${trust}\n\n——普通结局——`;
    } else {
      finalTitle = '伤痕累累的黎明';
      finalDesc = `零活了下来，但她在医院里躺了很久。通讯记录里留下了她最后一条消息：\n\n"活着...好累。"\n\n生命值: ${health} | 饱食度: ${hunger} | 信任度: ${trust}\n\n——勉强存活——`;
    }
  }

  s.triggerEnding(node.endingType, finalTitle, finalDesc);
};

export const useGameEngineInit = () => {
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const isGameOver = useGameStore((s) => s.isGameOver);

  useEffect(() => {
    if (isGameOver) return;
    const node = findNode(currentNodeId);
    if (!node) return;

    if (node.type === 'message') {
      runMessageNode(node);
    } else if (node.type === 'choice') {
      runChoiceNode(node);
    } else if (node.type === 'ending') {
      runEndingNode(node);
    }

    return clearTimer;
  }, [currentNodeId, isGameOver]);
};

export const useGameEngine = () => {
  const makeChoice = useCallback((option: ChoiceOption) => {
    const s = useGameStore.getState();
    if (!s.awaitingChoice || s.isGameOver) return;

    if (option.requiredItem) {
      const hasItem = s.inventory.some((i) => i.id === option.requiredItem);
      if (!hasItem) {
        s.addMessage({ sender: 'system', type: 'text', content: `【提示】你缺少所需物品` });
        return;
      }
    }

    s.setAwaitingChoice(false);
    if (option.playerResponse) {
      s.addMessage({ sender: 'player', type: 'text', content: option.playerResponse });
    }
    if (option.effects) s.applyEffects(option.effects);

    timerHandle = window.setTimeout(() => {
      s.setCurrentNode(option.nextNodeId);
    }, 800);
  }, []);

  const getCurrentChoices = useCallback((): ChoiceOption[] => {
    const nodeId = useGameStore.getState().currentNodeId;
    const node = findNode(nodeId);
    if (node?.type !== 'choice') return [];
    return node.choices;
  }, []);

  const useItem = useCallback((itemId: string) => {
    const nodeId = useGameStore.getState().currentNodeId;
    const node = findNode(nodeId);
    if (node?.type !== 'choice') return;
    const choice = node.choices.find((c) => c.requiredItem === itemId);
    if (choice) {
      makeChoice(choice);
    }
  }, [makeChoice]);

  return {
    makeChoice,
    getCurrentChoices,
    useItem,
  };
};

export const resetEngineState = () => {
  processedNodes.clear();
  activeNodeId = null;
  clearTimer();
};
