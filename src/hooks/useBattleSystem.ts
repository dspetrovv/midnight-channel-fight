
import { useState, useCallback } from 'react';
import { BattleState, Unit, UnitType, Element, ActionType, Skill } from '../types';
import { INITIAL_UNITS, SKILLS, ITEMS, INITIAL_INVENTORY, NAVIGATOR_LINES, HERO_ROSTER, ENEMY_ROSTER } from '../constants';

export const useBattleSystem = (onUnlockAchievement?: (id: string) => void) => {
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

    const [allOutStage, setAllOutStage] = useState<'NONE' | 'CUT_IN' | 'DUST' | 'FINISH'>('NONE');
    const [activeEffects, setActiveEffects] = useState<Record<string, string>>({});
    const [entranceStage, setEntranceStage] = useState<'HIDDEN' | 'BANNER' | 'UNITS' | 'DONE'>('HIDDEN');

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

        setTimeout(() => {
            setActiveEffects(prev => {
                const cleared = { ...prev };
                targetIds.forEach(id => delete cleared[id]);
                return cleared;
            });
        }, 1000);
    };
    
    const triggerNavLine = (category: keyof typeof NAVIGATOR_LINES) => {
        const lines = NAVIGATOR_LINES[category];
        const line = lines[Math.floor(Math.random() * lines.length)];
        setBattleState(prev => ({ ...prev, navigatorMessage: line }));
    };

    const initializeBattle = (partyIds: string[]) => {
        const heroes = HERO_ROSTER.filter(h => partyIds.includes(h.id));
        const battleUnits = [
            ...JSON.parse(JSON.stringify(heroes)),
            ...JSON.parse(JSON.stringify(ENEMY_ROSTER))
        ];

        setBattleState({
            units: battleUnits,
            turnOrder: battleUnits.map((u: Unit) => u.id),
            currentTurnIndex: 0,
            log: ["Battle Start! The Shadows approach!"],
            phase: 'START',
            oneMore: false,
            navigatorMessage: null,
            navigating: false,
            inventory: { ...INITIAL_INVENTORY }
        });
        
        setAllOutStage('NONE');
        setActiveEffects({});
        setEntranceStage('BANNER');
        
        setTimeout(() => setEntranceStage('UNITS'), 2000); 
        setTimeout(() => {
            setEntranceStage('DONE');
            triggerNavLine('START');
        }, 3500);
    };

    const nextTurn = () => {
        setBattleState(prev => {
            const nextIndex = (prev.currentTurnIndex + 1) % prev.turnOrder.length;
            const nextUnitId = prev.turnOrder[nextIndex];
            
            
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
                phase: 'TURN_START' // Use specific trigger phase
            };
        });
    };

    const startAllOutSequence = () => {
        setBattleState(prev => ({ ...prev, phase: 'PROCESSING' }));
        setAllOutStage('CUT_IN');
        triggerNavLine('ALL_OUT_ATTACK');

        setTimeout(() => setAllOutStage('DUST'), 1500);
        setTimeout(() => setAllOutStage('FINISH'), 4000);
        setTimeout(() => {
            setAllOutStage('NONE');
            setBattleState(prev => {
                const newUnits = prev.units.map(u => {
                    if (u.type === UnitType.ENEMY && u.hp > 0) {
                         return { ...u, hp: 0 };
                    }
                    return u;
                });
                
                const enemiesAlive = newUnits.some(u => u.type === UnitType.ENEMY && u.hp > 0);

                if (!enemiesAlive) {
                    const lines = NAVIGATOR_LINES['VICTORY'];
                    const line = lines[Math.floor(Math.random() * lines.length)];
                    if (onUnlockAchievement) onUnlockAchievement('OVERKILL'); // Trigger achievement                    
                    
                    return {
                        ...prev,
                        units: newUnits,
                        phase: 'VICTORY',
                        navigatorMessage: line,
                        log: [...prev.log, "ALL-OUT ATTACK! It's over!"]
                    };
                } else {
                    // Reset phase to TURN_START inside nextTurn logic wrapper would be ideal, 
                    // but since we are inside a timeout, we must be careful.
                    // We can just set phase to TURN_START here manually for the *current* unit (who initiated AO)
                    // OR call next turn. Usually AO ends turn unless One More?
                    // P4 logic: AO ends turn.
                    
                    // Calculate next index manually to emulate nextTurn within this state update context
                    const nextIndex = (prev.currentTurnIndex + 1) % prev.turnOrder.length;
                    const nextUnitId = prev.turnOrder[nextIndex];
                    const resetUnits = newUnits.map(u => 
                        u.id === nextUnitId ? { ...u, isDown: false, downAttribute: undefined, isDefending: false } : u
                    );

                    return {
                        ...prev,
                        units: resetUnits,
                        currentTurnIndex: nextIndex,
                        oneMore: false,
                        phase: 'TURN_START',
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
            setBattleState(prev => {
                console.log('move');
                
                let newUnits = [...prev.units];
                let newInventory = { ...prev.inventory };
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

                    if (rolledMiss && skill.element !== Element.HEAL) {
                        triggerEffect(targetIds, 'MISS');
                        logMsg = `${attacker.name} attacks but MISSES!`;
                        if (attacker.type === UnitType.HERO) triggerNavLine('PLAYER_MISS');
                        else triggerNavLine('ENEMY_MISS');
                    } else {
                        
                        const effectType = skill.power < 0 ? 'HEAL' : skill.element;

                        if (skill.power < 0 && skill.targetType === 'ALL') {
                            console.log('heal');
                            hitResults.push("Healed");
                            if (skill.targetType === 'ALL') {
                                const healingUnits = newUnits.filter((t) => t.type === 'HERO' && t.hp > 0)
                                healingUnits.forEach((u) => {
                                    const hp = u.hp + Math.abs(skill.power)
                                    newUnits[newUnits.findIndex((unit) => unit.id === u.id)] = { ...u, hp: hp > u.maxHp ? u.maxHp : hp };
                                })
                                
                                triggerEffect(healingUnits.map((hu) => hu.id), effectType);
                            }
                        } else {
                            triggerEffect(targetIds, effectType);
                        }

                        targets.forEach((target) => {
                            const isGuarding = target.isDefending;
                            const isWeak = !isGuarding && target.weaknesses.includes(skill.element);
                            const isResist = target.resistances.includes(skill.element);
                            
                            let damage = Math.floor(skill.power * (attacker.type === UnitType.HERO ? 2 : 1.5));
                            damage = Math.floor(damage * (0.9 + Math.random() * 0.2));

                            if (skill.power < 0) {
                                console.log('heal');
                                damage = skill.power;
                                hitResults.push("Healed");
                            } else {
                                console.log('damage');
                                
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
                                    if (onUnlockAchievement) onUnlockAchievement('TACTICIAN'); // Trigger achievement
                    console.log(1, onUnlockAchievement);
                                } else {
                                    const critChance = skill.element === Element.PHYS ? 0.2 : 0;
                                    const isCritical = !isGuarding && Math.random() < critChance;

                                    if (isCritical) {
                                        damage = Math.floor(damage * 1.5);
                                        hitResults.push("CRITICAL HIT!");
                                        oneMoreTriggered = true;
                                        causedDownType = 'CRITICAL';
                                        hasCrit = true;
                                        setTimeout(() => triggerEffect([target.id], 'CRITICAL'), 400);
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
console.log(newIsDown, targets);

                                    newUnits[tIndex] = { ...u, hp: newHp, isDown: newIsDown, downAttribute: newDownAttr };
                                    
                                    if (newHp <= 0 && u.type === UnitType.HERO) {
                                        hasAllyDown = true;
                                    }
                                }
                            }
                            
                            if (skill.power < 0) {
                                logMsg = `${attacker.name} uses ${skill.name} on ${skill.targetType === 'ALL' ? 'allias' : target.name}! ${Math.abs(damage)} ${damage < 0 ? 'recovered' : 'dmg'}! ${hitResults.join(' ')}`;
                            } else if (hitResults.length > 0) {
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
                } else if (action.type === 'SKIP') {
                    logMsg = `${attacker.name} cannot move!`;
                }

                const grantingOneMore = oneMoreTriggered && !prev.oneMore;
                let nextPhase = prev.phase;
                let nextTurnIndex = prev.currentTurnIndex;
                let nextOneMore = prev.oneMore;

                if (grantingOneMore) {
                     logMsg += ` ${attacker.name} gets ONE MORE!`;
                     // Same turn index, but phase needs to go back to TURN_START to re-trigger loop
                     nextPhase = 'TURN_START';
                     nextOneMore = true;
                } else {
                    // Prepare for next turn
                    // We can't update state twice in timeout easily, so we calculate next turn here
                    // BUT if we do that, the UI for the current action result might flash too fast.
                    // We should probably stay in PROCESSING, then let an effect or timeout trigger nextTurn.
                    // However, to keep logic simple in this refactor:
                    // We will advance the turn index HERE, but the 'TURN_START' phase change will trigger the next loop.
                    
                    const nextIndex = (prev.currentTurnIndex + 1) % prev.turnOrder.length;
                    const nextUnitId = prev.turnOrder[nextIndex];
                    const resetUnits = newUnits.map(u => 
                        u.id === nextUnitId ? { ...u, isDown: false, downAttribute: undefined, isDefending: false } : u
                    );
                    
                    newUnits = resetUnits; // Apply reset to next guy
                    nextTurnIndex = nextIndex;
                    nextOneMore = false;
                    nextPhase = 'TURN_START'; 
                }

                return {
                    ...prev,
                    units: newUnits,
                    inventory: newInventory,
                    log: [...prev.log, logMsg],
                    phase: nextPhase,
                    currentTurnIndex: nextTurnIndex,
                    oneMore: nextOneMore
                };
            });
        }, 500);
    };

    const pause = (x = 1000) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(x);
            }, x);
        });
    }

    const executeEnemyTurn = async (enemy: Unit) => {
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

    return {
        battleState,
        setBattleState,
        allOutStage,
        activeEffects,
        entranceStage,
        initializeBattle,
        executeAction,
        executeEnemyTurn,
        nextTurn,
        getCurrentUnit,
        getLivingEnemies,
        getLivingHeroes,
    };
};
