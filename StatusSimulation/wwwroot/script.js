/** * Ragnarok Classic Status Simulator Logic
 * Refined for high-stat accuracy and visual parity with RMS reference
 */

// 1. Level x to x+1 gives floor(x/5) + 3 points
function getPointsForLevel(level) {
    let points = 48; // Starting points
    for (let i = 1; i < level; i++) {
        points += Math.floor(i / 5) + 3;
    }
    return points;
}

// 2. Cost to raise from x to x+1 is floor((x-1)/10) + 2
function getStatCostTotal(baseValue) {
    let total = 0;
    for (let i = 1; i < baseValue; i++) {
        total += Math.floor((i - 1) / 10) + 2;
    }
    return total;
}

function calculate() {
    // Primary Inputs
    const lv = parseInt(document.getElementById('baseLv').value) || 1;
    const str = parseInt(document.getElementById('baseStr').value) || 1;
    const agi = parseInt(document.getElementById('baseAgi').value) || 1;
    const vit = parseInt(document.getElementById('baseVit').value) || 1;
    const int = parseInt(document.getElementById('baseInt').value) || 1;
    const dex = parseInt(document.getElementById('baseDex').value) || 1;
    const luk = parseInt(document.getElementById('baseLuk').value) || 1;

    // --- Point Management ---
    const totalPoints = getPointsForLevel(lv);
    const spent = getStatCostTotal(str) + getStatCostTotal(agi) + getStatCostTotal(vit) + 
                  getStatCostTotal(int) + getStatCostTotal(dex) + getStatCostTotal(luk);
    
    const remaining = totalPoints - spent;
    const ptDisplay = document.getElementById('statPoints');
    ptDisplay.innerText = remaining;
    ptDisplay.style.color = remaining < 0 ? "#ff4d4d" : "white";

    // --- Requirements (Next Point Cost) ---
    const stats = ['Str', 'Agi', 'Vit', 'Int', 'Dex', 'Luk'];
    const vals = [str, agi, vit, int, dex, luk];
    stats.forEach((s, i) => {
        document.getElementById('req' + s).innerText = Math.floor((vals[i] - 1) / 10) + 2;
    });

    // --- Substats ---

    // ATK: STR + floor(STR/10)^2 + floor(DEX/5) + floor(LUK/5)
    const atkBase = str + Math.pow(Math.floor(str / 10), 2) + Math.floor(dex / 5) + Math.floor(luk / 5);
    document.getElementById('atk').innerText = atkBase;

    // MATK: Min = INT + floor(INT/7)^2 | Max = INT + floor(INT/5)^2
    const minMatk = int + Math.pow(Math.floor(int / 7), 2);
    const maxMatk = int + Math.pow(Math.floor(int / 5), 2);
    document.getElementById('minMatk').innerText = minMatk;
    document.getElementById('maxMatk').innerText = maxMatk;

    // DEF Bonus: Based on screenshot scaling at high levels
    document.getElementById('vDef').innerText = Math.floor(vit * 0.8);

    // MDEF Bonus: 1 INT = 1 MDEF
    document.getElementById('vMdef').innerText = int;

    // HIT: LV + DEX
    document.getElementById('hit').innerText = lv + dex;

    // FLEE: Base = LV + AGI | Bonus = Matches the stat cost scaling (Pts Req) in reference
    document.getElementById('fleeBase').innerText = lv + agi;
    document.getElementById('fleeBonus').innerText = Math.floor((agi - 1) / 10) + 2;

    // CRITICAL: (LUK * 0.3) + 1
    document.getElementById('crit').innerText = (Math.floor(luk * 0.3) + 1).toFixed(1);
}

// Initial call
window.onload = calculate;