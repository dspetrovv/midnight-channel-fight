import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BattleState, Unit, UnitType, Element, ActionType, Skill } from './types';
import { INITIAL_UNITS, SKILLS, ELEMENT_COLORS, ITEMS, INITIAL_INVENTORY, NAVIGATOR_LINES, HERO_ROSTER, ENEMY_ROSTER } from './constants';
import { getTacticalAdvice } from './services/aiService';
import { Sparkles, Swords, Shield, Zap, Skull, Play, RefreshCw, Eye, Star, Triangle, BriefcaseMedical, Flame, Snowflake, Wind, Heart, Cross, Users, LogOut, AlertTriangle } from 'lucide-react';

// --- Components ---

interface HealthBarProps {
    current: number;
    max: number;
    color?: string;
    label?: string;
}

const HealthBar: React.FC<HealthBarProps> = ({ current, max, color = 'bg-green-500', label }) => {
    const percentage = Math.max(0, Math.min(100, (current / max) * 100));
    
    return (
        <div className="w-full">
            {label && <div className="text-[10px] md:text-xs font-bold uppercase mb-0.5 tracking-wider text-white text-shadow">{label}</div>}
            <div className="h-2 md:h-3 w-full bg-black/50 border border-white/30 p-0.5 transform -skew-x-12">
                <div 
                    className={`h-full ${color} transition-all duration-500 ease-out`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

interface BattleEffectProps {
    type: string;
}

const BattleEffect: React.FC<BattleEffectProps> = ({ type }) => {
    switch (type) {
        case Element.PHYS:
            return (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="w-32 md:w-64 h-2 bg-white animate-slash shadow-[0_0_20px_rgba(255,255,255,1)]"></div>
                    <div className="absolute w-32 md:w-64 h-1 bg-red-500 animate-slash delay-75 shadow-[0_0_20px_rgba(255,0,0,0.8)]"></div>
                </div>
            );
        case Element.FIRE:
            return (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="relative animate-burn">
                        <Flame className="w-16 h-16 md:w-[120px] md:h-[120px] text-red-500 fill-orange-400 drop-shadow-[0_0_15px_rgba(255,100,0,0.8)]" />
                        <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-50"></div>
                    </div>
                </div>
            );
        case Element.ICE:
            return (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="relative animate-freeze">
                        <Snowflake className="w-16 h-16 md:w-[120px] md:h-[120px] text-cyan-300 fill-white drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]" />
                         <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-30"></div>
                    </div>
                </div>
            );
        case Element.ELEC:
            return (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="relative animate-shock">
                        <Zap className="w-20 h-20 md:w-[140px] md:h-[140px] text-yellow-300 fill-white drop-shadow-[0_0_20px_rgba(255,255,0,1)]" />
                    </div>
                </div>
            );
        case Element.WIND:
            return (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="relative animate-whirlwind">
                        <Wind className="w-16 h-16 md:w-[120px] md:h-[120px] text-green-400 drop-shadow-[0_0_15px_rgba(0,255,100,0.8)]" />
                        <div className="absolute w-20 h-20 md:w-40 md:h-40 border-4 border-green-300 rounded-full opacity-50 border-dashed"></div>
                    </div>
                </div>
            );
        case 'HEAL':
        case 'REVIVE':
            return (
                 <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="relative animate-heal">
                        <Heart className="w-12 h-12 md:w-[80px] md:h-[80px] text-pink-500 fill-pink-200 drop-shadow-[0_0_10px_rgba(255,100,150,0.8)]" />
                        <div className="absolute -top-10 -right-10 animate-heal delay-100">
                             <Cross className="w-8 h-8 md:w-[40px] md:h-[40px] text-green-400 fill-green-200" />
                        </div>
                    </div>
                </div>
            );
         case 'SP':
            return (
                 <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="relative animate-heal">
                        <Sparkles className="w-12 h-12 md:w-[80px] md:h-[80px] text-purple-500 fill-purple-200 drop-shadow-[0_0_10px_rgba(200,100,255,0.8)]" />
                    </div>
                </div>
            );
        case 'CRITICAL':
            return (
                <div className="absolute inset-0 flex items-center justify-center z-[60] pointer-events-none">
                    <div className="relative animate-shake-hard z-50">
                        {/* Jagged backdrop */}
                        <div className="absolute inset-0 bg-black transform rotate-12 scale-150 opacity-70 clip-polygon-jagged"></div>
                        <span className="relative font-display text-3xl md:text-6xl text-yellow-300 italic drop-shadow-[4px_4px_0_rgba(0,0,0,1)] tracking-tighter transform -skew-x-12 border-black whitespace-nowrap">
                            CRITICAL!
                        </span>
                        <Star className="absolute -top-10 -left-10 w-12 h-12 text-white fill-yellow-200 animate-ping" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-32 h-32 bg-white/40 animate-ping rounded-full"></div>
                    </div>
                </div>
            );
        case 'MISS':
            return (
                <div className="absolute inset-0 flex items-center justify-center z-[60] pointer-events-none">
                    <div className="relative animate-float-up z-50">
                        <span className="font-display text-3xl md:text-5xl text-gray-400 italic drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-wider">
                            MISS
                        </span>
                    </div>
                </div>
            );
        default:
            return null;
    }
};

interface UnitProps {
    unit: Unit;
    isActive: boolean;
    isTargeting: boolean;
    onClick: () => void;
    activeEffect?: string | null;
}

const UnitCard: React.FC<UnitProps> = ({ unit, isActive, isTargeting, onClick, activeEffect }) => {
    return (
        <div 
            onClick={isTargeting ? onClick : undefined}
            className={`
                relative p-2 md:p-4 transition-all duration-300
                w-24 md:w-32 lg:w-40
                ${isActive ? 'scale-105 md:scale-110 z-10' : 'scale-100 opacity-90'}
                ${isTargeting ? 'animate-pulse ring-2 md:ring-4 ring-blue-500 ring-offset-2 ring-offset-black cursor-pointer' : ''}
                ${unit.hp <= 0 ? 'grayscale opacity-60' : ''}
                ${unit.isDown && unit.hp > 0 ? 'brightness-75' : ''}
            `}
        >
            {/* Effect Overlay */}
            {activeEffect && <BattleEffect type={activeEffect} />}

            {/* Portrait Frame */}
            <div className={`
                relative w-full ${unit.imageColor} border-2 md:border-4 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                overflow-hidden transform -skew-x-6 group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform
                h-24 md:h-32
            `}>
                {/* Placeholder for char image */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-2xl md:text-4xl text-black/20 uppercase">{unit.name.slice(0, 2)}</span>
                </div>
                
                {/* Image Avatar (Fallback to Placeholder via opacity/display logic) */}
                {unit.portrait && (
                    <img 
                        src={unit.portrait} 
                        alt={unit.name} 
                        className="absolute inset-0 w-full h-full object-cover z-10"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                    />
                )}
                
                {/* Status Icons */}
                <div className="absolute top-0 right-0 p-1 flex flex-col gap-1 z-20">
                    {unit.hp <= 0 && <span className="bg-purple-900 text-white text-[8px] md:text-[10px] px-1 font-bold">DEAD</span>}
                    {unit.isDown && unit.hp > 0 && <span className="bg-red-600 text-white text-[8px] md:text-[10px] px-1 font-bold animate-bounce">DOWN</span>}
                    {unit.isDefending && (
                        <div className="bg-gray-500 text-white p-0.5 rounded-full border border-white animate-pulse shadow-lg">
                            <Shield className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                    )}
                    <div className="flex flex-wrap gap-0.5 justify-end">
                        {unit.weaknesses.map(w => (
                            <div key={w} className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-black/20 border border-white/50" title={`Weak: ${w}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats - Names removed */}
            <div className="mt-2 md:mt-4 space-y-1 transform -skew-x-6">
                <HealthBar current={unit.hp} max={unit.maxHp} color="bg-yellow-400" />
                <HealthBar current={unit.sp} max={unit.maxSp} color="bg-purple-400" />
            </div>
            
            {isActive && (
                <div className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 text-yellow-300 animate-bounce">
                    <div className="transform rotate-90 text-xl md:text-3xl">➤</div>
                </div>
            )}
             {isTargeting && (
                 <div className="absolute inset-0 border-2 md:border-4 border-blue-400 animate-pulse opacity-50 pointer-events-none"></div>
            )}
        </div>
    );
};

interface EnemyUnitProps extends UnitProps {
    isEntering?: boolean;
}

const EnemyUnit: React.FC<EnemyUnitProps> = ({ unit, isActive, isTargeting, onClick, activeEffect, isEntering }) => {
    return (
        <div 
            className={`
                relative flex flex-col items-center transition-all duration-300
                ${unit.hp <= 0 ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100'}
                ${isTargeting ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]' : ''}
                pointer-events-none
            `}
        >
            {/* Effect Overlay */}
            {activeEffect && <BattleEffect type={activeEffect} />}

            <div 
                onClick={onClick}
                className={`
                    relative w-20 h-20 md:w-32 md:h-32 lg:w-48 lg:h-48 ${unit.imageColor} 
                    mask-blob animate-float
                    ${unit.isDown ? 'rotate-90 translate-y-4 md:translate-y-8' : ''}
                    ${isTargeting ? 'cursor-pointer' : ''}
                    ${isEntering ? 'animate-spawn-blob opacity-0' : ''}
                    pointer-events-auto
                `}
            >
                {/* Shadow Effect (Visual noise) */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-50 mix-blend-overlay"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Skull className="w-8 h-8 md:w-16 md:h-16 text-black/50" />
                </div>

                {/* Enemy Avatar */}
                {unit.portrait && (
                    <img 
                        src={unit.portrait} 
                        alt={unit.name} 
                        className="absolute inset-0 w-full h-full object-cover z-10"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                    />
                )}

                {/* Shield Icon for Defending Enemies */}
                {unit.isDefending && (
                    <div className="absolute top-0 left-0 bg-gray-700 p-1 rounded-full border-2 border-white animate-pulse z-30">
                         <Shield className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </div>
                )}
            </div>
            
            {/* Floating Health Bar */}
            <div 
                onClick={onClick}
                className={`
                    absolute -bottom-2 md:-bottom-4 w-20 md:w-32 transform skew-x-12 border md:border-2 border-black bg-black
                    pointer-events-auto
                    ${isTargeting ? 'cursor-pointer' : ''}
                    ${isEntering ? 'animate-spawn-blob opacity-0' : ''}
                `}
            >
                <div className="h-1.5 md:h-2 bg-red-600" style={{ width: `${(unit.hp / unit.maxHp) * 100}%` }}></div>
            </div>

            {/* Target Indicator */}
            {isTargeting && (
                 <div className="absolute inset-0 border-2 md:border-4 border-red-500 rounded-full animate-ping opacity-50 pointer-events-none"></div>
            )}
            
            {/* Status Badge for Enemies */}
            {unit.isDown && unit.hp > 0 && (
                <div className="absolute top-0 right-0 md:-right-2 bg-red-600 text-white text-[10px] md:text-xs px-1 md:px-2 py-0.5 font-bold animate-bounce z-20 transform skew-x-12 border border-white shadow-lg pointer-events-none">
                    DOWN
                </div>
            )}
            
            {/* Weakness Hit Indicator - Floating Text (ONLY FOR WEAKNESS) */}
            {unit.isDown && unit.downAttribute === 'WEAK' && (
                <div className="absolute -top-6 md:-top-10 font-display text-xl md:text-4xl text-yellow-400 italic text-shadow-black animate-bounce opacity-50 pointer-events-none">
                    WEAK!
                </div>
            )}
            
            {isActive && (
                <div className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 text-red-500 animate-bounce z-20 pointer-events-none">
                    <div className="transform rotate-90 text-2xl md:text-4xl drop-shadow-lg">➤</div>
                </div>
            )}
        </div>
    );
};

// --- Cinematic Components ---

const BattleStartBanner = () => {
    return (
        <div className="absolute inset-0 z-[60] pointer-events-none flex flex-col justify-center items-center gap-4 overflow-hidden">
            {/* Background Slash */}
            <div className="absolute inset-0 bg-yellow-400 transform skew-y-3 scale-y-0 animate-scale-in opacity-90 origin-center"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-[140%] h-24 md:h-40 bg-black transform -skew-x-12 flex items-center justify-center animate-slide-in-left shadow-[0_0_30px_rgba(0,0,0,0.5)] border-y-4 md:border-y-8 border-red-600">
                     <div className="flex items-center gap-4">
                         <Swords className="w-12 h-12 md:w-24 md:h-24 text-yellow-400" />
                         <span className="font-display text-6xl md:text-[8rem] text-white italic tracking-tighter">IT'S SHOWTIME!</span>
                         <AlertTriangle className="w-10 h-10 md:w-20 md:h-20 text-red-600 animate-pulse" />
                     </div>
                </div>
                <div className="absolute top-full mt-4 bg-red-600 text-white font-display text-2xl md:text-4xl px-8 py-1 transform skew-x-12 animate-slide-in-right delay-100 border-2 border-black">
                    ENEMY ENCOUNTER
                </div>
            </div>
        </div>
    );
};


const AllOutCutIn = () => {
    return (
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-center items-center gap-4 overflow-hidden">
            <div className="w-[120%] h-20 md:h-32 bg-yellow-400 transform -skew-x-12 flex items-center justify-center animate-slide-in-left shadow-xl border-y-4 md:border-y-8 border-black">
                <Eye className="w-[60px] h-[60px] md:w-[120px] md:h-[120px] text-black animate-pulse" />
                <span className="font-display text-5xl md:text-9xl text-black ml-4 md:ml-8 italic">LET'S GO!</span>
            </div>
            <div className="w-[120%] h-16 md:h-24 bg-red-600 transform skew-x-12 flex items-center justify-center animate-slide-in-right delay-100 shadow-xl border-y-4 md:border-y-8 border-black">
                <span className="font-display text-3xl md:text-6xl text-white mr-4 md:mr-8 italic">BEAT 'EM UP!</span>
                <Triangle className="w-[40px] h-[40px] md:w-[80px] md:h-[80px] text-white fill-current animate-spin-slow" />
            </div>
             <div className="absolute bottom-10 right-10 font-display text-6xl md:text-8xl text-white drop-shadow-[4px_4px_0_#000] animate-bounce">
                !
            </div>
        </div>
    );
};

const AllOutDustCloud = () => {
    const clouds = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${20 + Math.random() * 60}%`,
        top: `${20 + Math.random() * 60}%`,
        delay: Math.random() * 0.5,
        scale: 0.5 + Math.random() * 1.5,
        color: ['bg-gray-200', 'bg-white', 'bg-yellow-200'][Math.floor(Math.random() * 3)]
    }));

    return (
        <div className="absolute -inset-20 z-50 bg-black/30 animate-shake-hard overflow-hidden">
            {clouds.map(cloud => (
                <div 
                    key={cloud.id}
                    className={`absolute rounded-full opacity-0 animate-cloud ${cloud.color}`}
                    style={{
                        left: cloud.left,
                        top: cloud.top,
                        width: '100px',
                        height: '100px',
                        animationDelay: `${cloud.delay}s`,
                        transform: `scale(${cloud.scale})`
                    }}
                >
                     <div className="absolute inset-0 flex items-center justify-center">
                         <Star size={60} className="text-black animate-spin" />
                     </div>
                </div>
            ))}
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-6xl md:text-9xl text-red-600 italic rotate-12 drop-shadow-[5px_5px_0_#fff] animate-pulse">
                    BAM!
                </span>
            </div>
        </div>
    );
};

const AllOutFinish = () => {
    return (
        <div className="absolute inset-0 z-50 bg-yellow-400 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
             <div className="relative z-10 transform -rotate-6 text-center">
                 <h1 className="text-6xl md:text-[12rem] leading-none font-display text-black italic drop-shadow-[4px_4px_0px_rgba(255,255,255,1)] md:drop-shadow-[10px_10px_0px_rgba(255,255,255,1)] animate-scale-in">
                     FINISH!
                 </h1>
                 <div className="bg-black text-white text-xl md:text-4xl font-display px-4 py-1 md:px-8 md:py-2 inline-block transform skew-x-12 mt-4">
                     TOTAL DESTRUCTION
                 </div>
             </div>
             <div className="absolute bottom-0 right-0 w-1/2 h-full bg-black opacity-10 transform skew-x-12 translate-x-20"></div>
        </div>
    );
};

// --- Main App ---

type GameScreen = 'MENU' | 'TEAM' | 'BATTLE';
type EntranceStage = 'HIDDEN' | 'BANNER' | 'UNITS' | 'DONE';

export default function App() {
    const [screen, setScreen] = useState<GameScreen>('MENU');
    const [partyIds, setPartyIds] = useState<string[]>(['hero_1', 'hero_2', 'hero_3']); // Default Party
    
    const [battleState, setBattleState] = useState<BattleState>({
        units: [], 
        turnOrder: [],
        currentTurnIndex: 0,
        log: [],
        phase: 'START',
        oneMore: false,
        navigatorMessage: null,
        navigating: false,
        inventory: { ...INITIAL_INVENTORY }
    });

    const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
    const [menuOpen, setMenuOpen] = useState<'MAIN' | 'SKILL' | 'ITEM' | 'TARGET'>('MAIN');
    const [allOutStage, setAllOutStage] = useState<'NONE' | 'CUT_IN' | 'DUST' | 'FINISH'>('NONE');
    const [entranceStage, setEntranceStage] = useState<EntranceStage>('HIDDEN');

    const [activeEffects, setActiveEffects] = useState<Record<string, string>>({}); 
    const logEndRef = useRef<HTMLDivElement>(null);

    // --- Initialization ---

    const initializeBattle = () => {
        // Filter heroes based on partyIds
        const heroes = HERO_ROSTER.filter(h => partyIds.includes(h.id));
        // Use deep copy to reset stats
        const battleUnits = [
            ...JSON.parse(JSON.stringify(heroes)),
            ...JSON.parse(JSON.stringify(ENEMY_ROSTER))
        ];

        setBattleState({
            units: battleUnits,
            turnOrder: battleUnits.map(u => u.id), // Simple initiative for now
            currentTurnIndex: 0,
            log: ["Battle Start! The Shadows approach!"],
            phase: 'START',
            oneMore: false,
            navigatorMessage: null,
            navigating: false,
            inventory: { ...INITIAL_INVENTORY }
        });
        
        // Reset Battle UI state
        setMenuOpen('MAIN');
        setSelectedAction(null);
        setAllOutStage('NONE');
        setActiveEffects({});
        
        setScreen('BATTLE');
        
        // Trigger Entrance Sequence
        setEntranceStage('BANNER');
        
        // Sequence Timing
        setTimeout(() => {
            setEntranceStage('UNITS'); // Banner gone, animate units in (only enemies animate now)
        }, 2000); 
        
        setTimeout(() => {
            setEntranceStage('DONE'); // Animations finished, ready to play
            triggerNavLine('START');
        }, 3500);
    };

    // --- Engine Helpers ---

    const handleRestart = () => {
       setScreen('MENU');
    };

    const triggerNavLine = (category: keyof typeof NAVIGATOR_LINES) => {
        const lines = NAVIGATOR_LINES[category];
        const line = lines[Math.floor(Math.random() * lines.length)];
        setBattleState(prev => ({ ...prev, navigatorMessage: line }));
    };

    const getCurrentUnit = useCallback(() => {
        if (battleState.turnOrder.length === 0) return null;
        const id = battleState.turnOrder[battleState.currentTurnIndex];
        return battleState.units.find(u => u.id === id) || null;
    }, [battleState]);

    const getLivingEnemies = useCallback(() => {
        return battleState.units.filter(u => u.type === UnitType.ENEMY && u.hp > 0);
    }, [battleState]);

    const getLivingHeroes = useCallback(() => {
        return battleState.units.filter(u => u.type === UnitType.HERO && u.hp > 0);
    }, [battleState]);

    const addLog = (msg: string) => {
        setBattleState(prev => ({ ...prev, log: [...prev.log, msg] }));
    };

    const triggerEffect = (targetIds: string[], effectType: string) => {
        const newEffects = { ...activeEffects };
        targetIds.forEach(id => newEffects[id] = effectType);
        setActiveEffects(newEffects);

        // Clear effects after animation duration
        setTimeout(() => {
            setActiveEffects(prev => {
                const cleared = { ...prev };
                targetIds.forEach(id => delete cleared[id]);
                return cleared;
            });
        }, 1000);
    };

    // --- Logic Effects ---

    // Scroll log
    useEffect(() => {
        if (screen === 'BATTLE') {
            logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [battleState.log, screen]);

    // Initialization
    useEffect(() => {
        if (screen === 'BATTLE' && battleState.phase === 'START' && entranceStage === 'DONE') {
            const order = [...battleState.units].map(u => u.id);
            setBattleState(prev => ({
                ...prev,
                turnOrder: order,
                phase: 'PROCESSING'
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [battleState.phase, screen, entranceStage]);

    // Turn Processor
    useEffect(() => {
        if (screen !== 'BATTLE' || battleState.phase !== 'PROCESSING' || allOutStage !== 'NONE' || battleState.phase === 'VICTORY_PENDING') return;

        const currentUnit = getCurrentUnit();
        if (!currentUnit) return;

        if (currentUnit.hp <= 0) {
            nextTurn();
            return;
        }

        if (currentUnit.type === UnitType.ENEMY) {
            setTimeout(() => executeEnemyTurn(currentUnit), 1000);
        } else {
            setBattleState(prev => ({ ...prev, phase: 'PLAYER_INPUT', oneMore: prev.oneMore }));
            setMenuOpen('MAIN');
            setSelectedAction(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [battleState.phase, battleState.currentTurnIndex, battleState.oneMore, allOutStage, screen, entranceStage]);

    // Check Win/Loss
    useEffect(() => {
        if (screen !== 'BATTLE' || allOutStage !== 'NONE') return;

        const enemies = battleState.units.filter(u => u.type === UnitType.ENEMY && u.hp > 0);
        const heroes = battleState.units.filter(u => u.type === UnitType.HERO && u.hp > 0);

        if (enemies.length === 0 && battleState.phase !== 'START' && battleState.phase !== 'VICTORY' && battleState.phase !== 'VICTORY_PENDING') {
             setBattleState(prev => ({ ...prev, phase: 'VICTORY_PENDING' }));
             
             setTimeout(() => {
                 setBattleState(prev => ({ ...prev, phase: 'VICTORY' }));
                 triggerNavLine('VICTORY');
             }, 2000); // 2 second delay to see them die
        } else if (heroes.length === 0 && battleState.phase !== 'START') {
            setBattleState(prev => ({ ...prev, phase: 'DEFEAT' }));
        }
    }, [battleState.units, battleState.phase, allOutStage, screen]);

    // --- Actions ---

    const nextTurn = () => {
        setBattleState(prev => {
            const nextIndex = (prev.currentTurnIndex + 1) % prev.turnOrder.length;
            const nextUnitId = prev.turnOrder[nextIndex];
            
            // Recovery logic for the unit starting turn
            const newUnits = prev.units.map(u => 
                u.id === nextUnitId 
                    ? { ...u, isDown: false, downAttribute: undefined, isDefending: false } 
                    : u
            );

            return {
                ...prev,
                units: newUnits,
                currentTurnIndex: nextIndex,
                oneMore: false,
                phase: 'PROCESSING'
            };
        });
    };

    const startAllOutSequence = () => {
        setBattleState(prev => ({ ...prev, phase: 'PROCESSING' }));
        setAllOutStage('CUT_IN');
        triggerNavLine('ALL_OUT_ATTACK');

        // Sequence Timing
        setTimeout(() => setAllOutStage('DUST'), 1500);
        setTimeout(() => setAllOutStage('FINISH'), 4000);
        setTimeout(() => {
            setAllOutStage('NONE');
            setBattleState(prev => {
                // Recalculate units based on LATEST state
                const newUnits = prev.units.map(u => {
                    if (u.type === UnitType.ENEMY && u.hp > 0) {
                         return { ...u, hp: 0 };
                    }
                    return u;
                });
                
                const enemiesAlive = newUnits.some(u => u.type === UnitType.ENEMY && u.hp > 0);

                if (!enemiesAlive) {
                    // Victory Line
                    const lines = NAVIGATOR_LINES['VICTORY'];
                    const line = lines[Math.floor(Math.random() * lines.length)];
                    
                    return {
                        ...prev,
                        units: newUnits,
                        phase: 'VICTORY', // Direct transition
                        navigatorMessage: line,
                        log: [...prev.log, "ALL-OUT ATTACK! It's over!"]
                    };
                } else {
                    setTimeout(() => nextTurn(), 100);
                    return {
                        ...prev,
                        units: newUnits,
                        phase: 'PROCESSING',
                         log: [...prev.log, "ALL-OUT ATTACK!"]
                    };
                }
            });
        }, 6500);
    };

    const executeAction = (attacker: Unit, action: ActionType) => {
        if (action.type === 'ALL_OUT') {
            startAllOutSequence();
            return;
        }

        setBattleState(prev => ({ ...prev, phase: 'PROCESSING' }));

        setTimeout(() => {
            let newUnits = [...battleState.units];
            let newInventory = { ...battleState.inventory };
            let oneMoreTriggered = false;
            let logMsg = "";
            
            let hasCrit = false;
            let hasWeak = false;
            let hasAllyDown = false;
            let rolledMiss = false;

            if (action.type === 'ATTACK' || action.type === 'SKILL') {
                const skill = action.type === 'ATTACK' ? SKILLS.CLEAVE : SKILLS[action.skillId];
                if (action.type === 'ATTACK') { 
                    skill.cost = 0; skill.element = Element.PHYS; skill.name = 'Attack'; 
                }

                if (skill.cost > 0) {
                    newUnits = newUnits.map(u => u.id === attacker.id ? { ...u, sp: u.sp - skill.cost } : u);
                }

                const targets = action.targetId === 'ALL' 
                    ? newUnits.filter(u => u.type !== attacker.type && u.hp > 0)
                    : newUnits.filter(u => u.id === action.targetId);

                const hitResults: string[] = [];
                const targetIds = targets.map(t => t.id);
                
                const isHealing = skill.power < 0;
                const missChance = 0.10;
                rolledMiss = !isHealing && Math.random() < missChance;

                if (rolledMiss) {
                    triggerEffect(targetIds, 'MISS');
                    logMsg = `${attacker.name} attacks but MISSES!`;
                    
                    if (attacker.type === UnitType.HERO) triggerNavLine('PLAYER_MISS');
                    else triggerNavLine('ENEMY_MISS');

                } else {
                    const effectType = skill.power < 0 ? 'HEAL' : skill.element;
                    triggerEffect(targetIds, effectType);

                    targets.forEach(target => {
                        const isGuarding = target.isDefending;
                        const isWeak = !isGuarding && target.weaknesses.includes(skill.element);
                        const isResist = target.resistances.includes(skill.element);
                        
                        let damage = Math.floor(skill.power * (attacker.type === UnitType.HERO ? 2 : 1.5));
                        damage = Math.floor(damage * (0.9 + Math.random() * 0.2));

                        if (skill.power < 0) {
                             damage = skill.power;
                             hitResults.push("Healed");
                        } else {
                            if (isGuarding) {
                                damage = Math.floor(damage * 0.5);
                                hitResults.push("Blocked");
                            }

                            let causedDownType: 'WEAK' | 'CRITICAL' | null = null;

                            if (isWeak) {
                                damage = Math.floor(damage * 1.5);
                                oneMoreTriggered = true;
                                causedDownType = 'WEAK';
                                hitResults.push("WEAKNESS!");
                                hasWeak = true;
                            } else {
                                const critChance = skill.element === Element.PHYS ? 0.2 : 0.05;
                                const isCritical = !isGuarding && Math.random() < critChance;

                                if (isCritical) {
                                    damage = Math.floor(damage * 1.5);
                                    hitResults.push("CRITICAL HIT!");
                                    oneMoreTriggered = true;
                                    causedDownType = 'CRITICAL';
                                    hasCrit = true;
                                    
                                    setTimeout(() => {
                                        triggerEffect([target.id], 'CRITICAL');
                                    }, 400);
                                } else if (isResist) {
                                    damage = Math.floor(damage * 0.5);
                                    hitResults.push("Resisted");
                                }
                            }

                            const tIndex = newUnits.findIndex(u => u.id === target.id);
                            if (tIndex !== -1) {
                                let u = newUnits[tIndex];
                                let newHp = u.hp - damage;
                                newHp = Math.min(u.maxHp, Math.max(0, newHp));
                                
                                let newIsDown = u.isDown;
                                let newDownAttr = u.downAttribute;

                                if (causedDownType) {
                                    newIsDown = true;
                                    newDownAttr = causedDownType;
                                }

                                newUnits[tIndex] = { 
                                    ...u, 
                                    hp: newHp,
                                    isDown: newIsDown,
                                    downAttribute: newDownAttr
                                };
                                
                                if (newHp <= 0 && u.type === UnitType.HERO) {
                                    hasAllyDown = true;
                                }
                            }
                        }
                        
                        if (hitResults.length > 0) {
                            logMsg = `${attacker.name} uses ${skill.name} on ${target.name}! ${Math.abs(damage)} ${damage < 0 ? 'recovered' : 'dmg'}! ${hitResults.join(' ')}`;
                        } else {
                            logMsg = `${attacker.name} uses ${skill.name} on ${target.name}! ${Math.abs(damage)} dmg!`;
                        }
                    });
                    
                    if (hasAllyDown) triggerNavLine('ALLY_DOWN');
                    else if (hasCrit) triggerNavLine('CRITICAL_HIT');
                    else if (hasWeak) triggerNavLine('WEAKNESS_HIT');
                }

            } else if (action.type === 'ITEM') {
                const item = ITEMS[action.itemId];
                if (newInventory[item.id] > 0) {
                    newInventory[item.id]--;
                    const targetIndex = newUnits.findIndex(u => u.id === action.targetId);
                    if (targetIndex !== -1) {
                        const target = newUnits[targetIndex];
                        let resultMsg = "";
                        
                        triggerEffect([target.id], item.effectType);

                        if (item.effectType === 'HEAL') {
                            const healAmount = item.amount;
                            newUnits[targetIndex] = { ...target, hp: Math.min(target.maxHp, target.hp + healAmount) };
                            resultMsg = `Restored ${healAmount} HP`;
                        } else if (item.effectType === 'SP') {
                            const spAmount = item.amount;
                            newUnits[targetIndex] = { ...target, sp: Math.min(target.maxSp, target.sp + spAmount) };
                            resultMsg = `Restored ${spAmount} SP`;
                        } else if (item.effectType === 'REVIVE') {
                            if (target.hp <= 0) {
                                const reviveHp = Math.floor(target.maxHp * item.amount);
                                newUnits[targetIndex] = { ...target, hp: reviveHp, isDown: false, downAttribute: undefined };
                                resultMsg = `Revived with ${reviveHp} HP`;
                            } else {
                                resultMsg = "No effect...";
                            }
                        }
                        logMsg = `${attacker.name} used ${item.name} on ${target.name}! ${resultMsg}`;
                    }
                }
            } else if (action.type === 'GUARD') {
                const attackerIndex = newUnits.findIndex(u => u.id === attacker.id);
                if (attackerIndex !== -1) {
                    newUnits[attackerIndex] = { ...newUnits[attackerIndex], isDefending: true };
                }
                logMsg = `${attacker.name} is guarding!`;
            }

            addLog(logMsg);

            const grantingOneMore = oneMoreTriggered && !battleState.oneMore;

            setBattleState(prev => {
                if (grantingOneMore) {
                     addLog(`${attacker.name} gets ONE MORE!`);
                     const nextPhase = attacker.type === UnitType.HERO ? 'PLAYER_INPUT' : 'PROCESSING';
                     
                     return {
                         ...prev,
                         units: newUnits,
                         inventory: newInventory,
                         phase: nextPhase,
                         oneMore: true,
                         currentTurnIndex: prev.currentTurnIndex 
                     };
                } else {
                    return {
                        ...prev,
                        units: newUnits,
                        inventory: newInventory,
                    };
                }
            });

            if (!grantingOneMore) {
                setTimeout(nextTurn, 1000);
            }

        }, 500);
    };

    const executeEnemyTurn = (enemy: Unit) => {
        const heroes = getLivingHeroes();
        if (heroes.length === 0) return;

        let action: ActionType | null = null;

        const target = heroes[Math.floor(Math.random() * heroes.length)];
        const availableSkills = enemy.skills.filter(s => enemy.sp >= s.cost);
        
        if (availableSkills.length > 0 && Math.random() > 0.4) {
            const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
            action = { type: 'SKILL', skillId: randomSkill.id, targetId: target.id };
        } else {
            action = { type: 'ATTACK', targetId: target.id };
        }
        
        executeAction(enemy, action);
    };

    const handleNavigatorAnalysis = async () => {
        setBattleState(prev => ({ ...prev, navigating: true }));
        const advice = await getTacticalAdvice(battleState);
        setBattleState(prev => ({ ...prev, navigatorMessage: advice, navigating: false }));
    };

    // --- UI Handlers ---

    const handleAttackClick = () => {
        setMenuOpen('TARGET');
        setSelectedAction({ type: 'ATTACK', targetId: '' });
    };

    const handleSkillClick = (skillId: string) => {
        const skill = SKILLS[skillId];
        if (skill.targetType === 'ALL') {
            executeAction(getCurrentUnit()!, { type: 'SKILL', skillId, targetId: 'ALL' });
            setMenuOpen('MAIN');
        } else {
            setMenuOpen('TARGET');
            setSelectedAction({ type: 'SKILL', skillId, targetId: '' });
        }
    };

    const handleItemClick = (itemId: string) => {
        const item = ITEMS[itemId];
        setMenuOpen('TARGET');
        setSelectedAction({ type: 'ITEM', itemId, targetId: '' });
    }

    const handleTargetSelect = (targetId: string) => {
        if (!selectedAction) return;
        executeAction(getCurrentUnit()!, { ...selectedAction, targetId } as ActionType);
        setMenuOpen('MAIN');
    };

    const handleAllOutAttack = () => {
        executeAction(getCurrentUnit()!, { type: 'ALL_OUT' });
    };

    const togglePartyMember = (heroId: string) => {
        if (heroId === 'hero_1') return; // Yu is locked
        setPartyIds(prev => {
            if (prev.includes(heroId)) {
                return prev.filter(id => id !== heroId);
            } else {
                if (prev.length < 3) return [...prev, heroId]; // LIMIT TO 3
                return prev;
            }
        });
    };

    // --- Renders ---

    // --- MAIN MENU ---
    if (screen === 'MENU') {
        return (
            <div className="h-screen w-full bg-yellow-400 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 tv-noise opacity-20 pointer-events-none"></div>
                
                {/* Decorative Stripes */}
                <div className="absolute top-0 left-1/4 w-32 h-full bg-black/10 transform -skew-x-12"></div>
                <div className="absolute top-0 right-1/4 w-16 h-full bg-black/5 transform skew-x-12"></div>

                <div className="z-10 flex flex-col items-center gap-8">
                    <div className="text-6xl md:text-9xl font-display font-black italic text-black tracking-tighter transform -rotate-6 drop-shadow-lg mb-8">
                        MIDNIGHT<br/><span className="text-white text-stroke-black">CHANNEL</span>
                    </div>

                    <div className="flex flex-col gap-4 items-center w-full max-w-md">
                        <button 
                            onClick={initializeBattle}
                            className="group relative w-64 bg-black text-white font-display text-3xl italic py-4 px-8 transform -skew-x-12 hover:scale-110 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:bg-white hover:text-black border-4 border-black"
                        >
                            <div className="flex items-center justify-center gap-2 transform skew-x-12">
                                <Play className="fill-current" /> PLAY
                            </div>
                        </button>
                        
                        <button 
                            onClick={() => setScreen('TEAM')}
                            className="group relative w-64 bg-black text-white font-display text-3xl italic py-4 px-8 transform -skew-x-12 hover:scale-110 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:bg-white hover:text-black border-4 border-black"
                        >
                             <div className="flex items-center justify-center gap-2 transform skew-x-12">
                                <Users className="fill-current" /> TEAM
                            </div>
                        </button>
                    </div>
                </div>
                
                <div className="absolute bottom-4 right-4 font-display text-black text-xl opacity-50">
                    © 2024 INABA NET
                </div>
            </div>
        );
    }

    // --- TEAM SELECTION ---
    if (screen === 'TEAM') {
        return (
            <div className="h-screen w-full bg-[#222] flex flex-col">
                <div className="absolute inset-0 tv-noise opacity-10 pointer-events-none"></div>
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-yellow-400 transform rotate-12 rounded-full blur-3xl opacity-20"></div>

                {/* Header */}
                <div className="shrink-0 p-4 md:p-8 z-10 flex flex-col items-center">
                    <h1 className="text-4xl md:text-7xl font-display text-yellow-400 italic transform -skew-x-12 drop-shadow-[4px_4px_0_#000] shrink-0">
                        SELECT TEAM <span className="text-white text-2xl md:text-5xl ml-4">{partyIds.length}/3</span>
                    </h1>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-h-0 flex flex-col items-center w-full max-w-6xl mx-auto z-10">
                    {/* Grid - Scrollable */}
                    <div className="flex-1 w-full overflow-y-auto p-4">
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {HERO_ROSTER.map(hero => {
                                    const isSelected = partyIds.includes(hero.id);
                                    const isLocked = hero.id === 'hero_1';

                                    return (
                                        <div 
                                            key={hero.id}
                                            onClick={() => togglePartyMember(hero.id)}
                                            className={`
                                                relative h-32 md:h-48 border-4 transform transition-all duration-200 cursor-pointer group overflow-hidden
                                                ${isSelected 
                                                    ? 'border-yellow-400 bg-yellow-400/20 scale-105 shadow-[0_0_20px_rgba(250,204,21,0.4)]' 
                                                    : 'border-gray-600 bg-black/40 hover:border-white grayscale hover:grayscale-0'
                                                }
                                                ${isLocked ? 'cursor-not-allowed' : ''}
                                            `}
                                        >
                                            {/* Background Color Strip */}
                                            <div className={`absolute inset-0 ${hero.imageColor} opacity-50 transform skew-x-12 translate-x-1/2`}></div>
                                            
                                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                                <span className="font-display text-3xl md:text-6xl text-white drop-shadow-lg uppercase">{hero.name.slice(0, 2)}</span>
                                                <span className="font-display text-lg md:text-2xl text-white mt-1 md:mt-2">{hero.name}</span>
                                            </div>
                                            
                                            {/* Avatar Image */}
                                            {hero.portrait && (
                                                <img 
                                                    src={hero.portrait} 
                                                    alt={hero.name}
                                                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 mix-blend-overlay group-hover:opacity-100 group-hover:mix-blend-normal transition-all"
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                                                />
                                            )}

                                            {isSelected && (
                                                <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-yellow-400 text-black font-bold text-xs md:text-base px-2 py-0.5 md:py-1 transform skew-x-12 z-20">
                                                    {isLocked ? 'LEADER' : 'READY'}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                    </div>

                    {/* Footer - Fixed at bottom */}
                    <div className="shrink-0 p-4 w-full flex justify-center bg-[#222]/90 backdrop-blur-sm border-t border-white/10">
                         <button 
                            onClick={() => setScreen('MENU')}
                            className="bg-white text-black font-display text-2xl md:text-4xl py-3 px-12 border-4 border-black hover:bg-yellow-400 hover:scale-105 transition-all transform -skew-x-12 shadow-[4px_4px_0_#000]"
                        >
                            CONFIRM
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- BATTLE SCREEN (Existing Logic Wrappers) ---
    const currentUnit = getCurrentUnit();
    // Safety check for battle render
    if (!currentUnit) return null; 

    const isPlayerTurn = currentUnit?.type === UnitType.HERO && battleState.phase === 'PLAYER_INPUT';
    const livingEnemies = getLivingEnemies();
    const allEnemiesDown = livingEnemies.length > 0 && livingEnemies.every(e => e.isDown);
    const showAllOutBtn = isPlayerTurn && allEnemiesDown;

    // Determine valid targets for cursor
    const isReviveAction = selectedAction?.type === 'ITEM' && ITEMS[(selectedAction as any).itemId]?.effectType === 'REVIVE';
    const isHealOrSupportAction = (selectedAction?.type === 'ITEM' && !isReviveAction) || (selectedAction?.type === 'SKILL' && SKILLS[(selectedAction as any).skillId]?.power < 0);

    if (battleState.phase === 'VICTORY') {
        return (
            <div className="h-screen w-full bg-yellow-400 flex flex-col items-center justify-center animate-fade-in relative overflow-hidden">
                <div className="tv-noise absolute inset-0 opacity-50 pointer-events-none"></div>
                <h1 className="text-6xl md:text-9xl font-display italic text-black transform -skew-x-12 mb-8 drop-shadow-lg">VICTORY</h1>
                <button 
                    onClick={handleRestart} 
                    className="px-8 py-4 bg-black text-white font-bold text-2xl transform skew-x-12 hover:scale-110 transition-transform cursor-pointer z-50 flex items-center gap-2"
                >
                    <LogOut size={24} /> RETURN TO MENU
                </button>
            </div>
        );
    }

    if (battleState.phase === 'DEFEAT') {
        return (
            <div className="h-screen w-full bg-black flex flex-col items-center justify-center animate-fade-in relative">
                <div className="tv-noise absolute inset-0 opacity-20 pointer-events-none"></div>
                <h1 className="text-6xl md:text-8xl font-display text-red-600 mb-8 animate-pulse">GAME OVER</h1>
                <button 
                    onClick={handleRestart} 
                    className="px-8 py-4 border-2 border-white text-white font-bold text-2xl hover:bg-white hover:text-black transition-colors cursor-pointer z-50 flex items-center gap-2"
                >
                     <LogOut size={24} /> RETURN TO MENU
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-[#222] relative overflow-hidden flex flex-col">
            {/* Cinematic Overlays */}
            {allOutStage === 'CUT_IN' && <AllOutCutIn />}
            {allOutStage === 'DUST' && <AllOutDustCloud />}
            {allOutStage === 'FINISH' && <AllOutFinish />}
            {entranceStage === 'BANNER' && <BattleStartBanner />}

            {/* Background Layers */}
            <div className="absolute inset-0 tv-noise opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#332] -z-10"></div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-5 pointer-events-none">
                <div className="absolute top-[10%] -left-10 w-[120%] h-32 bg-yellow-400/10 transform -rotate-3"></div>
                <div className="absolute bottom-[20%] -right-10 w-[120%] h-16 bg-yellow-400/5 transform rotate-3"></div>
            </div>

            {/* Navigator */}
            <div className="absolute top-2 left-2 md:top-4 md:left-4 z-30 max-w-[200px] md:max-w-xs">
                <div className="flex items-start gap-1 md:gap-2">
                    <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-pink-400 border-2 md:border-4 border-white overflow-hidden shadow-lg">
                             <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs md:text-base">RISE</div>
                        </div>
                        {battleState.navigating && (
                            <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 bg-yellow-400 rounded-full animate-spin border border-black"></div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className={`
                            bg-black/80 text-white p-2 md:p-3 rounded-r-xl rounded-bl-xl border-l-4 border-pink-400 text-xs md:text-sm font-display tracking-wide shadow-lg
                            ${battleState.navigating ? 'animate-pulse' : 'pop-in'}
                        `}>
                            "{battleState.navigatorMessage || "Analyzing battlefield..."}"
                        </div>
                         <button 
                            onClick={handleNavigatorAnalysis}
                            disabled={battleState.navigating}
                            className="mt-1 md:mt-2 text-[10px] md:text-xs bg-yellow-400 text-black px-2 py-1 font-bold rounded hover:bg-white transition-colors flex items-center gap-1"
                        >
                            <RefreshCw size={10} className="md:w-3 md:h-3" /> NAVI
                        </button>
                    </div>
                </div>
            </div>

            {/* BATTLE STAGE */}
            <div className="flex-1 relative flex flex-col">
                
                {/* Enemies Area */}
                <div className="flex-1 flex items-center justify-center gap-1 md:gap-16 px-2 pt-24 portrait:pt-32 landscape:pt-4 md:pt-12">
                    {battleState.units.filter(u => u.type === UnitType.ENEMY).map(unit => (
                        <EnemyUnit 
                            key={unit.id} 
                            unit={unit} 
                            isActive={currentUnit?.id === unit.id}
                            isTargeting={menuOpen === 'TARGET' && !isHealOrSupportAction && !isReviveAction && unit.hp > 0}
                            onClick={() => menuOpen === 'TARGET' && !isHealOrSupportAction && !isReviveAction && unit.hp > 0 && handleTargetSelect(unit.id)}
                            activeEffect={activeEffects[unit.id]}
                            isEntering={entranceStage === 'UNITS'}
                        />
                    ))}
                </div>

                {/* Heroes Area */}
                <div className="flex items-end justify-center gap-1 md:gap-4 pb-20 md:pb-8 px-1 md:px-4 h-48 md:h-auto">
                     {battleState.units.filter(u => u.type === UnitType.HERO).map(unit => {
                        // Determine if this specific unit is a valid target
                        const isDead = unit.hp <= 0;
                        const canTarget = (isReviveAction && isDead) || (isHealOrSupportAction && !isDead);
                        
                        return (
                            <UnitCard 
                                key={unit.id}
                                unit={unit}
                                isActive={currentUnit?.id === unit.id}
                                isTargeting={menuOpen === 'TARGET' && canTarget} 
                                onClick={() => {
                                    if (menuOpen === 'TARGET' && canTarget) {
                                        handleTargetSelect(unit.id);
                                    }
                                }}
                                activeEffect={activeEffects[unit.id]}
                            />
                        );
                     })}
                </div>
            </div>

            {/* UI OVERLAY */}
            {isPlayerTurn && menuOpen !== 'TARGET' && (
                <div className={`
                    absolute z-40
                    portrait:top-24 portrait:right-4 
                    landscape:bottom-16 landscape:left-4
                    md:bottom-20 md:left-20
                `}>
                    <div className="relative">
                        <div className="absolute -inset-10 border-[20px] md:border-[40px] border-yellow-400/20 rounded-full animate-spin-slow pointer-events-none"></div>
                        
                        {menuOpen === 'MAIN' ? (
                            <div className={`
                                flex flex-col gap-1 md:gap-2 transform -skew-x-6 scale-90 md:scale-100
                                portrait:items-end portrait:origin-top-right
                                landscape:items-start landscape:origin-bottom-left
                                animate-slide-up-fade
                            `}>
                                {showAllOutBtn && (
                                    <button onClick={handleAllOutAttack} className="group relative w-60 md:w-72 bg-red-600 text-white font-display text-3xl md:text-5xl italic py-2 px-4 md:py-4 md:px-8 shadow-[4px_4px_0px_0px_#000] md:shadow-[8px_8px_0px_0px_#000] hover:translate-x-4 transition-all animate-pulse z-50 mb-2 md:mb-4 border-2 md:border-4 border-black hover:bg-white hover:text-red-600">
                                        <span className="relative z-10 flex items-center gap-2"><Skull className="w-8 h-8 md:w-10 md:h-10" /> ALL-OUT!</span>
                                        <div className="absolute inset-0 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left -z-1"></div>
                                    </button>
                                )}
                                <button 
                                    onClick={handleAttackClick} 
                                    disabled={showAllOutBtn}
                                    className={`
                                        w-36 md:w-48 bg-black text-white font-display text-xl md:text-2xl py-1 px-4 md:py-2 md:px-6 border-l-4 md:border-l-8 transition-all
                                        ${showAllOutBtn 
                                            ? 'border-gray-600 opacity-30 grayscale cursor-not-allowed' 
                                            : 'border-yellow-400 hover:bg-yellow-400 hover:text-black hover:border-black'
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-2"><Swords className="w-4 h-4 md:w-5 md:h-5"/> ATTACK</span>
                                </button>
                                <button 
                                    onClick={() => setMenuOpen('SKILL')} 
                                    disabled={showAllOutBtn}
                                    className={`
                                        w-36 md:w-48 bg-black text-white font-display text-xl md:text-2xl py-1 px-4 md:py-2 md:px-6 border-l-4 md:border-l-8 transition-all
                                        ${showAllOutBtn 
                                            ? 'border-gray-600 opacity-30 grayscale cursor-not-allowed' 
                                            : 'border-blue-400 hover:bg-blue-400 hover:text-black hover:border-black'
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 md:w-5 md:h-5"/> SKILL</span>
                                </button>
                                <button 
                                    onClick={() => setMenuOpen('ITEM')} 
                                    disabled={showAllOutBtn}
                                    className={`
                                        w-36 md:w-48 bg-black text-white font-display text-xl md:text-2xl py-1 px-4 md:py-2 md:px-6 border-l-4 md:border-l-8 transition-all
                                        ${showAllOutBtn 
                                            ? 'border-gray-600 opacity-30 grayscale cursor-not-allowed' 
                                            : 'border-green-400 hover:bg-green-400 hover:text-black hover:border-black'
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-2"><BriefcaseMedical className="w-4 h-4 md:w-5 md:h-5"/> ITEM</span>
                                </button>
                                <button 
                                    onClick={() => executeAction(currentUnit, { type: 'GUARD' })} 
                                    disabled={showAllOutBtn}
                                    className={`
                                        w-36 md:w-48 bg-black text-white font-display text-xl md:text-2xl py-1 px-4 md:py-2 md:px-6 border-l-4 md:border-l-8 transition-all
                                        ${showAllOutBtn 
                                            ? 'border-gray-600 opacity-30 grayscale cursor-not-allowed' 
                                            : 'border-gray-400 hover:bg-gray-400 hover:text-black hover:border-black'
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-2"><Shield className="w-4 h-4 md:w-5 md:h-5"/> GUARD</span>
                                </button>
                            </div>
                        ) : menuOpen === 'SKILL' ? (
                            <div className={`
                                bg-black/90 p-2 md:p-4 border-2 border-white max-h-40 md:max-h-64 overflow-y-auto min-w-[200px] md:min-w-[250px]
                                portrait:origin-top-right landscape:origin-bottom-left
                            `}>
                                <div className="text-yellow-400 font-bold mb-2 border-b border-gray-600 pb-1 flex justify-between text-sm md:text-base">
                                    <span>SELECT SKILL</span>
                                    <button onClick={() => setMenuOpen('MAIN')} className="text-[10px] text-white bg-gray-700 px-1">BACK</button>
                                </div>
                                {currentUnit.skills.map(skill => (
                                    <button 
                                        key={skill.id}
                                        disabled={currentUnit.sp < skill.cost}
                                        onClick={() => handleSkillClick(skill.id)}
                                        className={`
                                            w-full text-left py-1 md:py-2 px-2 mb-1 flex justify-between items-center font-display tracking-wider text-sm md:text-base
                                            hover:bg-white/20 transition-colors
                                            ${currentUnit.sp < skill.cost ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <span className={ELEMENT_COLORS[skill.element] || 'text-white'}>
                                            {skill.name}
                                        </span>
                                        <span className="text-[10px] md:text-xs text-gray-400">{skill.cost} SP</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                             /* ITEM MENU */
                             <div className={`
                                bg-black/90 p-2 md:p-4 border-2 border-white max-h-40 md:max-h-64 overflow-y-auto min-w-[200px] md:min-w-[250px]
                                portrait:origin-top-right landscape:origin-bottom-left
                             `}>
                                <div className="text-green-400 font-bold mb-2 border-b border-gray-600 pb-1 flex justify-between text-sm md:text-base">
                                    <span>SELECT ITEM</span>
                                    <button onClick={() => setMenuOpen('MAIN')} className="text-[10px] text-white bg-gray-700 px-1">BACK</button>
                                </div>
                                {Object.values(ITEMS).map(item => (
                                    <button 
                                        key={item.id}
                                        disabled={!battleState.inventory[item.id]}
                                        onClick={() => handleItemClick(item.id)}
                                        className={`
                                            w-full text-left py-1 md:py-2 px-2 mb-1 flex justify-between items-center font-display tracking-wider text-sm md:text-base
                                            hover:bg-white/20 transition-colors
                                            ${!battleState.inventory[item.id] ? 'opacity-30 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-white">{item.name}</span>
                                            <span className="text-[8px] md:text-[10px] text-gray-400 truncate max-w-[120px]">{item.description}</span>
                                        </div>
                                        <span className="text-lg md:text-xl font-bold text-yellow-300">x{battleState.inventory[item.id] || 0}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Target Selection Cancel Overlay */}
            {menuOpen === 'TARGET' && (
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-full px-4">
                    <div className="bg-blue-600/80 text-white px-4 py-1 text-xs md:text-sm font-bold border border-white whitespace-nowrap">
                        {isReviveAction ? "SELECT FALLEN ALLY" : isHealOrSupportAction ? "SELECT ALLY" : "SELECT ENEMY"}
                    </div>
                    <button 
                        onClick={() => setMenuOpen('MAIN')} 
                        className="bg-black/80 text-white border border-white px-4 py-2 md:px-6 text-sm md:text-base font-bold animate-bounce whitespace-nowrap"
                    >
                        CANCEL
                    </button>
                </div>
            )}

            {/* Log Window (Top Right) */}
            <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none overflow-hidden hidden lg:block">
                 <div className="h-full w-full bg-gradient-to-l from-black/80 to-transparent p-8 flex flex-col justify-end items-end text-right space-y-2">
                     {battleState.log.slice(-6).map((line, i) => (
                         <div key={i} className="text-white font-display text-xl transform -skew-x-12 bg-black/40 px-4 py-1 border-r-4 border-yellow-400 pop-in">
                             {line}
                         </div>
                     ))}
                     <div ref={logEndRef} />
                 </div>
            </div>
            
            {/* Mobile Log (Bottom) */}
            <div className="absolute bottom-0 w-full h-16 bg-black/80 border-t-2 border-yellow-400 lg:hidden flex items-center px-4 z-50 overflow-hidden">
                 <p className="text-white font-display text-xs md:text-sm">{battleState.log[battleState.log.length - 1]}</p>
            </div>

        </div>
    );
}