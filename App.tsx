
import React, { useState, useEffect } from 'react';
import { MUSIC_TRACKS } from './constants';
import { AudioController } from './components/AudioController';
import { MainMenu } from './components/Screens/MainMenu';
import { TeamSelection } from './components/Screens/TeamSelection';
import { BattleScreen } from './components/Screens/BattleScreen';
import { useBattleSystem } from './hooks/useBattleSystem';
import { UnitType } from './types';

// --- Main App ---

type GameScreen = 'MENU' | 'TEAM' | 'BATTLE';

export default function App() {
    const [screen, setScreen] = useState<GameScreen>('MENU');
    const [partyIds, setPartyIds] = useState<string[]>(['hero_1', 'hero_2', 'hero_3']); // Default Party

    const {
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
        handleNavigatorAnalysis
    } = useBattleSystem();

    // --- Music Logic ---
    let currentTrack = MUSIC_TRACKS.MENU;
    if (screen === 'BATTLE') {
        if (battleState.phase === 'VICTORY') {
            currentTrack = MUSIC_TRACKS.VICTORY;
        } else {
            currentTrack = MUSIC_TRACKS.BATTLE;
        }
    }

    // --- Logic Effects Integration ---

    // Initialization
    useEffect(() => {
        if (screen === 'BATTLE' && battleState.phase === 'START' && entranceStage === 'DONE') {
             // Kickoff the battle loop once entrance is done
             const order = [...battleState.units].map(u => u.id);
             setBattleState(prev => ({
                 ...prev,
                 turnOrder: order,
                 phase: 'TURN_START' // Triggers the loop
             }));
        }
    }, [battleState.phase, screen, entranceStage, setBattleState]);

    // Main Battle Loop - Controlled by 'TURN_START' Phase
    useEffect(() => {
        // Only run this logic when we are at the start of a turn (or "One More")
        if (screen !== 'BATTLE' || battleState.phase !== 'TURN_START' || entranceStage !== 'DONE') return;

        const currentUnit = getCurrentUnit();
        if (!currentUnit) return;

        // Skip dead units
        if (currentUnit.hp <= 0) {
            nextTurn();
            return;
        }

        if (currentUnit.type === UnitType.ENEMY) {
            // Enemy Turn: Wait a bit, then execute
            // executeEnemyTurn will set phase to 'PROCESSING', stopping this effect from looping
            setTimeout(() => executeEnemyTurn(currentUnit), 1000);
        } else {
            // Player Turn: Unlock input
            setBattleState(prev => ({ ...prev, phase: 'PLAYER_INPUT' }));
        }
    }, [battleState.phase, screen, entranceStage, getCurrentUnit, nextTurn, executeEnemyTurn, setBattleState]);

    // Check Win/Loss (Run on every state update)
    useEffect(() => {
        if (screen !== 'BATTLE' || allOutStage !== 'NONE') return;

        const enemies = battleState.units.filter(u => u.type === UnitType.ENEMY && u.hp > 0);
        const heroes = battleState.units.filter(u => u.type === UnitType.HERO && u.hp > 0);

        if (enemies.length === 0 && battleState.phase !== 'START' && battleState.phase !== 'VICTORY' && battleState.phase !== 'VICTORY_PENDING') {
             setBattleState(prev => ({ ...prev, phase: 'VICTORY_PENDING' }));
             setTimeout(() => {
                 setBattleState(prev => ({ ...prev, phase: 'VICTORY' }));
             }, 2000);
        } else if (heroes.length === 0 && battleState.phase !== 'START') {
            setBattleState(prev => ({ ...prev, phase: 'DEFEAT' }));
        }
    }, [battleState.units, battleState.phase, allOutStage, screen, setBattleState]);


    const togglePartyMember = (heroId: string) => {
        if (heroId === 'hero_1') return; // Yu is locked
        setPartyIds(prev => {
            if (prev.includes(heroId)) {
                return prev.filter(id => id !== heroId);
            } else {
                if (prev.length < 3) return [...prev, heroId];
                return prev;
            }
        });
    };

    const handleStartBattle = () => {
        initializeBattle(partyIds);
        setScreen('BATTLE');
    };

    return (
        <>
            <AudioController track={currentTrack} />
            
            {screen === 'MENU' && (
                <MainMenu 
                    onPlay={handleStartBattle} 
                    onTeam={() => setScreen('TEAM')} 
                />
            )}

            {screen === 'TEAM' && (
                <TeamSelection 
                    partyIds={partyIds} 
                    onToggleMember={togglePartyMember} 
                    onConfirm={() => setScreen('MENU')} 
                />
            )}

            {screen === 'BATTLE' && (
                <BattleScreen 
                    battleState={battleState}
                    allOutStage={allOutStage}
                    activeEffects={activeEffects}
                    entranceStage={entranceStage}
                    getCurrentUnit={getCurrentUnit}
                    getLivingEnemies={getLivingEnemies}
                    executeAction={executeAction}
                    executeEnemyTurn={executeEnemyTurn}
                    nextTurn={nextTurn}
                    handleNavigatorAnalysis={handleNavigatorAnalysis}
                    onRestart={() => setScreen('MENU')}
                />
            )}
        </>
    );
}
