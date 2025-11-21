
export enum Element {
    PHYS = 'Physical',
    FIRE = 'Fire',
    ICE = 'Ice',
    ELEC = 'Elec',
    WIND = 'Wind',
    HEAL = 'Heal'
}

export enum UnitType {
    HERO = 'HERO',
    ENEMY = 'ENEMY'
}

export interface Skill {
    id: string;
    name: string;
    cost: number; // SP cost
    element: Element;
    power: number;
    targetType: 'SINGLE' | 'ALL';
}

export interface Item {
    id: string;
    name: string;
    description: string;
    effectType: 'HEAL' | 'SP' | 'REVIVE';
    amount: number; // Flat amount for HEAL/SP, Percentage (0-1) for REVIVE
    targetType: 'SINGLE';
}

export interface Unit {
    id: string;
    name: string;
    type: UnitType;
    hp: number;
    maxHp: number;
    sp: number;
    maxSp: number;
    weaknesses: Element[];
    resistances: Element[];
    skills: Skill[];
    isDown: boolean;
    downAttribute?: 'WEAK' | 'CRITICAL'; // Tracks why the unit is down
    isDefending: boolean;
    imageColor: string; // For placeholder visuals
    portrait?: string; // Placeholder URL
}

export interface BattleState {
    units: Unit[];
    turnOrder: string[]; // Array of Unit IDs
    currentTurnIndex: number;
    log: string[];
    phase: 'START' | 'TURN_START' | 'PLAYER_INPUT' | 'PROCESSING' | 'VICTORY' | 'DEFEAT' | 'ALL_OUT_PROMPT' | 'VICTORY_PENDING';
    oneMore: boolean; // Is the current turn a "One More"?
    navigatorMessage: string | null;
    navigating: boolean;
    inventory: Record<string, number>; // ItemID -> Quantity
}

export type ActionType = 
    | { type: 'ATTACK'; targetId: string }
    | { type: 'SKILL'; skillId: string; targetId: string | 'ALL' }
    | { type: 'GUARD' }
    | { type: 'ITEM'; itemId: string; targetId: string }
    | { type: 'ALL_OUT' }
    | { type: 'SKIP' }; // For stunned units
