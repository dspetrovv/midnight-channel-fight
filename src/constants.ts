
import { Element, Skill, Unit, UnitType, Item } from './types';

export const SKILLS: Record<string, Skill> = {
    CLEAVE: { id: 'CLEAVE', name: 'Cleave', cost: 0, element: Element.PHYS, power: 30, targetType: 'SINGLE' },
    AGI: { id: 'AGI', name: 'Agi', cost: 4, element: Element.FIRE, power: 50, targetType: 'SINGLE' },
    BUFU: { id: 'BUFU', name: 'Bufu', cost: 4, element: Element.ICE, power: 50, targetType: 'SINGLE' },
    ZIO: { id: 'ZIO', name: 'Zio', cost: 4, element: Element.ELEC, power: 50, targetType: 'SINGLE' },
    GARU: { id: 'GARU', name: 'Garu', cost: 4, element: Element.WIND, power: 50, targetType: 'SINGLE' },
    MAZIODYNE: { id: 'MAZIODYNE', name: 'Maziodyne', cost: 12, element: Element.ELEC, power: 80, targetType: 'ALL' },
    DIA: { id: 'DIA', name: 'Dia', cost: 3, element: Element.PHYS, power: -50, targetType: 'SINGLE' },
    BASH: { id: 'BASH', name: 'Bash', cost: 5, element: Element.PHYS, power: 40, targetType: 'SINGLE' },
    MEDITRA: { id: 'MEDITRA', name: 'Media', cost: 10, element: Element.HEAL, power: -50, targetType: 'ALL' },
};

export const ITEMS: Record<string, Item> = {
    MEDICINE: { 
        id: 'MEDICINE', 
        name: 'Medicine', 
        description: 'Restores 100 HP to 1 ally', 
        effectType: 'HEAL', 
        amount: 100, 
        targetType: 'SINGLE' 
    },
    SNUFF_SOUL: { 
        id: 'SNUFF_SOUL', 
        name: 'Snuff Soul', 
        description: 'Restores 50 SP to 1 ally', 
        effectType: 'SP', 
        amount: 50, 
        targetType: 'SINGLE' 
    },
    REVIVAL_BEAD: { 
        id: 'REVIVAL_BEAD', 
        name: 'Revival Bead', 
        description: 'Revives ally with 50% HP', 
        effectType: 'REVIVE', 
        amount: 0.5, 
        targetType: 'SINGLE' 
    }
};

export const INITIAL_INVENTORY: Record<string, number> = {
    MEDICINE: 5,
    SNUFF_SOUL: 3,
    REVIVAL_BEAD: 2
};

export const MUSIC_TRACKS = {
    MENU: '/music/menu.mp3',
    BATTLE: '/public/music/battle.mp3',
    VICTORY: '/public/music/victory.mp3'
};

export const HERO_ROSTER: Unit[] = [
    {
        id: 'hero_1',
        name: 'Yu',
        type: UnitType.HERO,
        hp: 250,
        maxHp: 250,
        sp: 100,
        maxSp: 100,
        weaknesses: [Element.WIND],
        resistances: [Element.ELEC],
        skills: [SKILLS.CLEAVE, SKILLS.ZIO, SKILLS.MAZIODYNE],
        isDown: false,
        isDefending: false,
        imageColor: 'bg-zinc-400',
        portrait: '/public/assets/Yu.png'
    },
    {
        id: 'hero_2',
        name: 'Chie',
        type: UnitType.HERO,
        hp: 220,
        maxHp: 220,
        sp: 60,
        maxSp: 60,
        weaknesses: [Element.FIRE],
        resistances: [Element.ICE],
        skills: [SKILLS.CLEAVE, SKILLS.BUFU],
        isDown: false,
        isDefending: false,
        imageColor: 'bg-green-400',
        portrait: '/public/assets/Chie.png'
    },
    {
        id: 'hero_3',
        name: 'Yosuke',
        type: UnitType.HERO,
        hp: 210,
        maxHp: 210,
        sp: 70,
        maxSp: 70,
        weaknesses: [Element.ELEC],
        resistances: [Element.WIND],
        skills: [SKILLS.CLEAVE, SKILLS.GARU],
        isDown: false,
        isDefending: false,
        imageColor: 'bg-orange-400',
        portrait: '/public/assets/Yosuke.png'
    },
    {
        id: 'hero_4',
        name: 'Kanji',
        type: UnitType.HERO,
        hp: 300,
        maxHp: 300,
        sp: 40,
        maxSp: 40,
        weaknesses: [Element.WIND],
        resistances: [Element.ELEC, Element.PHYS],
        skills: [SKILLS.BASH, SKILLS.ZIO],
        isDown: false,
        isDefending: false,
        imageColor: 'bg-yellow-200',
        portrait: '/public/assets/Kanji.png'
    },
    {
        id: 'hero_5',
        name: 'Teddie',
        type: UnitType.HERO,
        hp: 190,
        maxHp: 190,
        sp: 90,
        maxSp: 90,
        weaknesses: [Element.ELEC],
        resistances: [Element.ICE],
        skills: [SKILLS.BUFU, SKILLS.MEDITRA],
        isDown: false,
        isDefending: false,
        imageColor: 'bg-blue-300',
        portrait: '/public/assets/Teddie.png'
    }
];

export const ENEMY_ROSTER: Unit[] = [
    {
        id: 'enemy_1',
        name: 'Burning Beetle',
        type: UnitType.ENEMY,
        hp: 150,
        maxHp: 150,
        sp: 999,
        maxSp: 999,
        weaknesses: [Element.ICE],
        resistances: [Element.FIRE],
        skills: [SKILLS.AGI],
        isDown: false,
        isDefending: false,
        imageColor: 'bg-red-600',
        portrait: '/assets/enemy_1.png'
    },
    {
        id: 'enemy_2',
        name: 'Voltaic Weights',
        type: UnitType.ENEMY,
        hp: 200,
        maxHp: 200,
        sp: 999,
        maxSp: 999,
        weaknesses: [Element.WIND],
        resistances: [Element.ELEC, Element.PHYS],
        skills: [SKILLS.ZIO],
        isDown: false,
        isDefending: false,
        imageColor: 'bg-yellow-600',
        portrait: '/assets/enemy_2.png'
    },
    {
        id: 'enemy_3',
        name: 'Ice Cube',
        type: UnitType.ENEMY,
        hp: 180,
        maxHp: 180,
        sp: 999,
        maxSp: 999,
        weaknesses: [Element.FIRE],
        resistances: [Element.ICE],
        skills: [SKILLS.BUFU],
        isDown: false,
        isDefending: false,
        imageColor: 'bg-blue-400',
        portrait: '/assets/enemy_3.png'
    }
];

// Combined for fallback/initialization if needed
export const INITIAL_UNITS: Unit[] = [...HERO_ROSTER, ...ENEMY_ROSTER];

export const ELEMENT_COLORS: Record<Element, string> = {
    [Element.PHYS]: 'text-gray-200',
    [Element.FIRE]: 'text-red-500',
    [Element.ICE]: 'text-cyan-300',
    [Element.ELEC]: 'text-yellow-300',
    [Element.WIND]: 'text-green-400',
    [Element.HEAL]: 'text-green-400',
};

export const NAVIGATOR_LINES = {
    START: [
        "Here they come! Get ready, everyone!",
        "Shadows detected! Let's do this!",
        "Enemy reading confirmed! Be careful!"
    ],
    VICTORY: [
        "All right! That was amazing!",
        "Enemy eliminated! Good job, Senpai!",
        "We did it! Is everyone okay?"
    ],
    WEAKNESS_HIT: [
        "Yes! You hit them right where it hurts!",
        "Nice one! Their defenses are down!",
        "It's super effective! ...Wait, wrong game!",
        "That's it! Keep hitting their weakness!"
    ],
    CRITICAL_HIT: [
        "Whoa! That was a massive hit!",
        "Critical hit! You're on fire!",
        "Amazing power! They didn't stand a chance!"
    ],
    PLAYER_MISS: [
        "Oh no! You missed!",
        "Careful! It's moving fast!",
        "Don't let it get to you! Try again!"
    ],
    ENEMY_MISS: [
        "Haha! They can't hit us!",
        "Looking cool, Senpai! You dodged it!",
        "Missed by a mile! Keep it up!"
    ],
    ALLY_DOWN: [
        "Someone's down! We need healing, stat!",
        "Oh no! Senpai, help them!",
        "Critical damage to ally! Be careful!"
    ],
    ALL_OUT_ATTACK: [
        "Get 'em! All-Out Attack!",
        "This is our chance! Finish them off!",
        "Go, everyone! Show them our power!"
    ]
};

export const ACHIEVEMENTS = [
    { id: 'FIRST_STEP', title: 'Into the TV', description: 'Enter the Midnight Channel for the first time.', icon: 'Tv' },
    { id: 'TACTICIAN', title: 'One More!', description: 'Exploit an enemy weakness.', icon: 'Zap' },
    { id: 'OVERKILL', title: 'Pile On!', description: 'Finish a battle with an All-Out Attack.', icon: 'Skull' },
    { id: 'UNTOUCHABLE', title: 'Can\'t Touch This', description: 'Win a battle without taking any damage.', icon: 'Shield' },
];