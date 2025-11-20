
import React, { useEffect, useRef, useState } from 'react';
import { Unit, ActionType, UnitType, BattleState } from '../../types';
import { ITEMS, SKILLS } from '../../constants';
import { UnitCard } from '../UnitCard';
import { EnemyUnit } from '../EnemyUnit';
import { BattleMenu } from '../UI/BattleMenu';
import { AllOutCutIn, AllOutDustCloud, AllOutFinish } from '../Cinematics/AllOutAttack';
import { BattleStartBanner } from '../Cinematics/BattleStartBanner';
import { RefreshCw, LogOut } from 'lucide-react';

interface BattleScreenProps {
    battleState: BattleState;
    allOutStage: string;
    activeEffects: Record<string, string>;
    entranceStage: string;
    getCurrentUnit: () => Unit | null | undefined;
    getLivingEnemies: () => Unit[];
    executeAction: (attacker: Unit, action: ActionType) => void;
    executeEnemyTurn: (enemy: Unit) => void;
    nextTurn: () => void;
    handleNavigatorAnalysis: () => void;
    onRestart: () => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
    battleState,
    allOutStage,
    activeEffects,
    entranceStage,
    getCurrentUnit,
    getLivingEnemies,
    executeAction,
    executeEnemyTurn,
    nextTurn,
    handleNavigatorAnalysis,
    onRestart
}) => {
    const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
    const [menuOpen, setMenuOpen] = useState<'MAIN' | 'SKILL' | 'ITEM' | 'TARGET'>('MAIN');
    const logEndRef = useRef<HTMLDivElement>(null);

    // Scroll log
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [battleState.log]);

    const currentUnit = getCurrentUnit();
    // If unit is null, and not victory/defeat, just return (likely loading or error)
    if (!currentUnit && battleState.phase !== 'VICTORY' && battleState.phase !== 'DEFEAT' && battleState.phase !== 'VICTORY_PENDING') return null;

    const isPlayerTurn = currentUnit?.type === UnitType.HERO && battleState.phase === 'PLAYER_INPUT';
    const livingEnemies = getLivingEnemies();
    const allEnemiesDown = livingEnemies.length > 0 && livingEnemies.every(e => e.isDown);
    const showAllOutBtn = isPlayerTurn && allEnemiesDown;
    
    // Target handling helpers
    const isReviveAction = selectedAction?.type === 'ITEM' && ITEMS[(selectedAction as any).itemId]?.effectType === 'REVIVE';
    const isHealOrSupportAction = (selectedAction?.type === 'ITEM' && !isReviveAction) || (selectedAction?.type === 'SKILL' && SKILLS[(selectedAction as any).skillId]?.power < 0);


    // Handlers for Menu
    const handleAttackClick = () => {
        setMenuOpen('TARGET');
        setSelectedAction({ type: 'ATTACK', targetId: '' });
    };

    const handleSkillClick = (skillId: string) => {
        const skill = SKILLS[skillId];
        if (skill.targetType === 'ALL') {
            executeAction(currentUnit!, { type: 'SKILL', skillId, targetId: 'ALL' });
            setMenuOpen('MAIN');
        } else {
            setMenuOpen('TARGET');
            setSelectedAction({ type: 'SKILL', skillId, targetId: '' });
        }
    };

    const handleItemClick = (itemId: string) => {
        setMenuOpen('TARGET');
        setSelectedAction({ type: 'ITEM', itemId, targetId: '' });
    };

    const handleTargetSelect = (targetId: string) => {
        if (!selectedAction) return;
        executeAction(currentUnit!, { ...selectedAction, targetId } as ActionType);
        setMenuOpen('MAIN');
        setSelectedAction(null);
    };
    
    const handleAllOutAttack = () => {
        executeAction(currentUnit!, { type: 'ALL_OUT' });
    };


    if (battleState.phase === 'VICTORY') {
        return (
            <div className="h-screen w-full bg-yellow-400 flex flex-col items-center justify-center animate-fade-in relative overflow-hidden">
                <div className="tv-noise absolute inset-0 opacity-50 pointer-events-none"></div>
                <h1 className="text-6xl md:text-9xl font-display italic text-black transform -skew-x-12 mb-8 drop-shadow-lg">VICTORY</h1>
                <button 
                    onClick={onRestart} 
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
                    onClick={onRestart} 
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
                <BattleMenu 
                    currentUnit={currentUnit!}
                    inventory={battleState.inventory}
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                    onAttack={handleAttackClick}
                    onSkill={handleSkillClick}
                    onItem={handleItemClick}
                    onGuard={() => executeAction(currentUnit!, { type: 'GUARD' })}
                    onAllOut={handleAllOutAttack}
                    showAllOutBtn={!!showAllOutBtn}
                />
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
};
