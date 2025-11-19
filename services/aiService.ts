import { GoogleGenAI } from "@google/genai";
import { BattleState, Unit, UnitType } from '../types';

const SYSTEM_INSTRUCTION = `
You are "Rise", a high-energy, supportive, and analytical Battle Navigator in a Persona-style RPG. 
You are speaking to the team leader "Senpai" (Yu).
Your goal is to analyze the battlefield and provide brief, tactical advice (max 2 sentences).
Use a pop, idol-like, enthusiastic tone. 
If enemies are weak to something, shout it out. 
If the team is low on health, warn them frantically.
Never mention game mechanics like "HP integer", instead use "looking tired" or "stumbling".
Format the output as plain text.
`;

export const getTacticalAdvice = async (state: BattleState): Promise<string> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            return "Senpai! I can't connect to the database (API Key missing)!";
        }

        const ai = new GoogleGenAI({ apiKey });
        
        // Construct a prompt describing the scene
        const heroes = state.units.filter(u => u.type === UnitType.HERO);
        const enemies = state.units.filter(u => u.type === UnitType.ENEMY);
        
        const heroStatus = heroes.map(h => `${h.name}: ${Math.floor((h.hp / h.maxHp) * 100)}% HP`).join(', ');
        const enemyStatus = enemies.map(e => 
            `${e.name} (Weakness: ${e.weaknesses.join(', ')}, Status: ${e.isDown ? 'DOWN' : 'Standing'})`
        ).join(' | ');

        const prompt = `
            Current Battle Status:
            Heroes: ${heroStatus}
            Enemies: ${enemyStatus}
            
            What should we do next, Rise?
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                maxOutputTokens: 100,
            }
        });

        return response.text || "Be careful everyone!";
    } catch (error) {
        console.error("Gemini Error", error);
        return "Signal interference! I can't analyze them right now!";
    }
};
