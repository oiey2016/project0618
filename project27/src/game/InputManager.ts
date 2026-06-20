import { PLAYER_CONFIGS } from './constants';
import type { PlayerControls } from './types';

export class InputManager {
  private keys: Set<string> = new Set();
  private pressedKeys: Set<string> = new Set();

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  init(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.keys.has(e.code)) {
      this.pressedKeys.add(e.code);
    }
    this.keys.add(e.code);
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.keys.delete(e.code);
  }

  isPressed(controls: PlayerControls, action: keyof PlayerControls): boolean {
    return this.keys.has(controls[action]);
  }

  wasPressed(controls: PlayerControls, action: keyof PlayerControls): boolean {
    return this.pressedKeys.has(controls[action]);
  }

  update(): void {
    this.pressedKeys.clear();
  }

  getPlayerControls(playerId: number): PlayerControls {
    const config = PLAYER_CONFIGS.find((p) => p.id === playerId);
    if (!config) {
      throw new Error(`Player ${playerId} not found`);
    }
    return config.controls;
  }
}
