// iRO Wiki Classic Accuracy Update
const character = {
    baseLevel: 1,
    stats: { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 }
};

function calculate() {
    // 1. Get Inputs
    character.baseLevel = parseInt(document.getElementById("baseLv").value) || 1;
    ["Str", "Agi", "Vit", "Int", "Dex", "Luk"].forEach(s => {
        character.stats[s.toLowerCase()] = parseInt(document.getElementById(`base${s}`).value) || 1;
    });

    const { str, agi, vit, int, dex, luk } = character.stats;
    const bLv = character.baseLevel;

    // 2. APPLY IRO WIKI CLASSIC FORMULAS
    // ATK = STR + (STR/10)^2 + DEX/5 + LUK/5
    const statusAtk = str + Math.floor(Math.pow(Math.floor(str / 10), 2)) + Math.floor(dex / 5) + Math.floor(luk / 5);

    // MATK: Min = INT + (INT/7)^2 | Max = INT + (INT/5)^2
    const minMatk = int + Math.floor(Math.pow(Math.floor(int / 7), 2));
    const maxMatk = int + Math.floor(Math.pow(Math.floor(int / 5), 2));

    // HIT = Level + DEX + LUK/3
    const hit = bLv + dex + Math.floor(luk / 3);

    // FLEE = Level + AGI + LUK/5
    const flee = bLv + agi + Math.floor(luk / 5);

    // CRIT = (LUK * 0.3) + 1
    const crit = (luk * 0.3 + 1).toFixed(1);

    // 3. STAT POINT LOGIC
    // Points Gained: floor(level/5) + 3 per level up
    let totalPoints = 48; // Starting points
    for (let i = 1; i < bLv; i++) {
        totalPoints += Math.floor(i / 5) + 3;
    }

    // Cost: floor((current_stat - 1) / 10) + 2
    let spentPoints = 0;
    Object.values(character.stats).forEach(statVal => {
        for (let i = 1; i < statVal; i++) {
            spentPoints += Math.floor((i - 1) / 10) + 2;
        }
    });

    // 4. Update UI
    document.getElementById("atk").innerText = statusAtk;
    document.getElementById("minMatk").innerText = minMatk;
    document.getElementById("maxMatk").innerText = maxMatk;
    document.getElementById("hit").innerText = hit;
    document.getElementById("crit").innerText = crit;
    document.getElementById("vDef").innerText = vit; // Soft DEF
    document.getElementById("vMdef").innerText = int; // Soft MDEF
    document.getElementById("fleeBase").innerText = bLv + agi; // Base Display
    document.getElementById("fleeBonus").innerText = Math.floor(luk / 5); 
    document.getElementById("statPoints").innerText = totalPoints - spentPoints;

    // Update REQ costs in table
    ["Str", "Agi", "Vit", "Int", "Dex", "Luk"].forEach(s => {
        const currentVal = character.stats[s.toLowerCase()];
        document.getElementById(`req${s}`).innerText = Math.floor((currentVal - 1) / 10) + 2;
    });
}

window.onload = calculate;