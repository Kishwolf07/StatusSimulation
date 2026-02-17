const characterData = [
    { name: "LORD KNIGHT", img: "https://i.pinimg.com/originals/e7/2b/63/e72b634231bf6fe0f94f0075b1eadf69.gif", hpFactor: 1.5 },
    { name: "HIGH WIZARD", img: "https://i.pinimg.com/originals/3e/77/e9/3e77e9d81ac939ff528f136735b4fb29.gif", hpFactor: 0.8 },
    { name: "ASSASSIN CROSS", img: "https://i.pinimg.com/originals/e2/13/27/e2132766bd78c91f8a6b2ac3c10dd154.gif", hpFactor: 1.2 }
];

let currentCharIndex = 0;
let character = {
    baseLevel: 1,
    stats: { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 }
};

function getPointsGainedAtLevel(lvl) {
    return Math.floor(lvl / 5) + 3;
}

function getStatIncreaseCost(currentVal) {
    return Math.floor((currentVal - 1) / 10) + 2;
}

function getTotalCostToReachStat(target) {
    let cost = 0;
    for (let i = 1; i < target; i++) {
        cost += getStatIncreaseCost(i);
    }
    return cost;
}

function updateUI() {
    const { str, agi, vit, int, dex, luk } = character.stats;
    const lv = character.baseLevel;
    const job = characterData[currentCharIndex];

    // 1. Point Pool
    let totalPool = 48;
    for (let i = 1; i < lv; i++) {
        totalPool += getPointsGainedAtLevel(i);
    }
    const totalSpent = Object.values(character.stats).reduce((sum, v) => sum + getTotalCostToReachStat(v), 0);
    const availablePoints = totalPool - totalSpent;

    // 2. Calculations
    const atk = str + Math.pow(Math.floor(str / 10), 2) + Math.floor(dex / 5) + Math.floor(luk / 5);
    const matkMin = int + Math.pow(Math.floor(int / 7), 2);
    const matkMax = int + Math.pow(Math.floor(int / 5), 2);
    const hit = lv + dex;
    const crit = Math.floor(luk * 0.3) + 1;
    const flee = lv + agi;
    const pDodge = Math.floor(luk / 10) + 1;
    const aspd = 150 + Math.floor(agi * 0.4) + Math.floor(dex * 0.1);
    
    // HP Logic
    const maxHP = Math.floor((lv * 100 * job.hpFactor) * (1 + vit * 0.01));
    const basePossibleHP = 25000; // Reference for bar width
    const hpPercent = Math.min((maxHP / basePossibleHP) * 100, 100);

    // 3. Update Vitals
    document.getElementById("hpText").innerText = `${maxHP.toLocaleString()} / ${maxHP.toLocaleString()}`;
    document.getElementById("hpBar").style.width = hpPercent + "%";
    document.getElementById("statPoints").innerText = availablePoints;

    // 4. Combat Stats
    document.getElementById("atkVal").innerText = atk;
    document.getElementById("matkMin").innerText = matkMin;
    document.getElementById("matkMax").innerText = matkMax;
    document.getElementById("hitVal").innerText = hit;
    document.getElementById("critVal").innerText = crit;
    document.getElementById("softDef").innerText = vit;
    document.getElementById("hardDef").innerText = Math.floor(vit * 0.8);
    document.getElementById("softMdef").innerText = int;
    document.getElementById("hardMdef").innerText = Math.floor(vit / 2);
    document.getElementById("fleeVal").innerText = flee;
    document.getElementById("pDodge").innerText = pDodge;
    document.getElementById("aspdVal").innerText = aspd;

    // 5. Update Attribute Rows
    document.querySelectorAll(".attr-row").forEach(row => {
        const statName = row.dataset.stat;
        const val = character.stats[statName];
        const cost = getStatIncreaseCost(val);
        const inputField = row.querySelector(".stat-input");

        if (document.activeElement !== inputField) {
            inputField.value = val;
        }

        // Invalid (0) check
        if (val <= 0 || availablePoints < 0) {
            inputField.classList.add("invalid");
        } else {
            inputField.classList.remove("invalid");
        }

        row.querySelector(".cost-tag").innerText = cost;
        row.querySelector(".plus").disabled = (availablePoints < cost || val >= 99);
        row.querySelector(".minus").disabled = (val <= 1);
    });
}

function resetStats() {
    character.stats = { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 };
    updateUI();
}

function changeCharacter(dir) {
    currentCharIndex = (currentCharIndex + dir + characterData.length) % characterData.length;
    document.getElementById('main-avatar').src = characterData[currentCharIndex].img;
    document.getElementById('floating-name').innerText = characterData[currentCharIndex].name;
    updateUI();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("baseLvl").addEventListener("input", (e) => {
        character.baseLevel = Math.max(1, Math.min(99, parseInt(e.target.value) || 1));
        updateUI();
    });

    document.querySelectorAll(".attr-row").forEach(row => {
        const statName = row.dataset.stat;
        const input = row.querySelector(".stat-input");

        // Direct Input Handler
        input.addEventListener("input", (e) => {
            let newVal = parseInt(e.target.value);
            
            if (isNaN(newVal) || newVal <= 0) {
                character.stats[statName] = 0; 
                updateUI();
                return;
            }

            if (newVal > 99) newVal = 99;

            // Temp check for points
            const oldVal = character.stats[statName];
            character.stats[statName] = newVal;
            
            // Recalculate spent points
            const lv = character.baseLevel;
            let totalPool = 48;
            for (let i = 1; i < lv; i++) totalPool += getPointsGainedAtLevel(i);
            const totalSpent = Object.values(character.stats).reduce((sum, v) => sum + getTotalCostToReachStat(v), 0);

            if (totalPool - totalSpent < 0) {
                // Keep the value but UI will show it as red via availablePoints check in updateUI
            }
            updateUI();
        });

        row.querySelector(".plus").onclick = () => { 
            character.stats[statName]++; 
            updateUI(); 
        };
        
        row.querySelector(".minus").onclick = () => { 
            if(character.stats[statName] > 1) { 
                character.stats[statName]--; 
                updateUI(); 
            }
        };
    });
    updateUI();
});