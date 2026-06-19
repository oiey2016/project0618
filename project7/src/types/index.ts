export type StatKey = "church" | "people" | "army" | "wealth";

export interface Stats {
  church: number;
  people: number;
  army: number;
  wealth: number;
}

export interface StatChange {
  church?: number;
  people?: number;
  army?: number;
  wealth?: number;
}

export interface CardChoice {
  label: string;
  effect: StatChange;
}

export interface Card {
  id: string;
  title: string;
  character: string;
  emoji: string;
  description: string;
  leftChoice: CardChoice;
  rightChoice: CardChoice;
}

export interface StatMeta {
  key: StatKey;
  name: string;
  emoji: string;
  color: string;
  bgClass: string;
  barClass: string;
  deathLow: string;
  deathHigh: string;
}
