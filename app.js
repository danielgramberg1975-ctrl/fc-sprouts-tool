// ===== DATA — pas dit gerust aan of vul het verder aan =====
const gameData = {
    "1-15": {
        recipes: [
            {
                name: "Maple Lumber",
                ingredients: [
                    { material: "Maple Log", qty: 3, source: "Verzamelen", location: "Central Shroud (Botanist Lv1)" }
                ]
            },
            {
                name: "Bronze Ingot",
                ingredients: [
                    { material: "Copper Ore", qty: 2, source: "Delven", location: "Central Thanalan (Miner Lv1)" },
                    { material: "Tin Ore", qty: 1, source: "Delven", location: "Western Thanalan (Miner Lv1)" }
                ]
            }
        ],
        fishing: [
            { name: "Rothlyt Rain Trout", level: 5, bait: "Plump Worm", location: "Rothlyt Sound" },
            { name: "Halfmoon Goby", level: 10, bait: "Krill", location: "Ul'dah - Halfmoon Waterway" }
        ],
        macros: [
            { title: "Basis HQ Macro (Lv 1-15)", text: "/ac \"Basic Synthesis\" <wait.3>\n/ac \"Basic Touch\" <wait.3>\n/ac \"Basic Touch\" <wait.3>\n/ac \"Basic Synthesis\" <wait.3>" }
        ],
        content: [
            { title: "Sastasha (Lv 15)", text: "Eerste dungeon, ontgrendeld via de main scenario quest. Let op de bomkoppen die exploderen." },
            { title: "Chocobo Companion (Lv 20 quest)", text: "Bij Lv 15 kun je al richting deze quest werken — geeft je eigen chocobo mount én buddy." }
        ]
    },
    "16-30": {
        recipes: [
            {
                name: "Iron Ingot",
                ingredients: [
                    { material: "Iron Ore", qty: 3, source: "Delven", location: "Outer La Noscea (Miner Lv15)" }
                ]
            }
        ],
        fishing: [
            { name: "Lake Tahtotl", level: 20, bait: "Versatile Lure", location: "Outer La Noscea" }
        ],
        macros: [
            { title: "Standaard Macro (Lv 16-30)", text: "/ac \"Basic Synthesis\" <wait.3>\n/ac \"Standard Touch\" <wait.3>\n/ac \"Standard Touch\" <wait.3>\n/ac \"Basic Synthesis\" <wait.3>" }
        ],
        content: [
            { title: "The Bowl of Embers (Lv 20)", text: "Eerste raid/trial content, goed om als groep te doen." }
        ]
    },
    "31-50": {
        recipes: [
            {
                name: "Steel Ingot",
                ingredients: [
                    { material: "Iron Ore", qty: 2, source: "Delven", location: "Coerthas Central Highlands (Miner Lv30)" },
                    { material: "Coal", qty: 1, source: "Delven", location: "Coerthas Central Highlands" }
                ]
            }
        ],
        fishing: [
            { name: "Coerthas Chub", level: 35, bait: "Plump Worm", location: "Coerthas Central Highlands" }
        ],
        macros: [
            { title: "Gevorderde Macro (Lv 31-50)", text: "/ac \"Inner Quiet\" <wait.2>\n/ac \"Standard Touch\" <wait.3>\n/ac \"Standard Touch\" <wait.3>\n/ac \"Basic Synthesis\" <wait.3>" }
        ],
        content: [
            { title: "Main Scenario naar A Realm Reborn finale", text: "Rond level 50 kom je bij het einde van de ARR main scenario — bewaar tijd voor de laatste dungeon-reeks." }
        ]
    }
};

let currentTier = "1-15";

// ===== LEVEL WISSELEN =====
function changeLevel(tierKey, btnEl) {
    currentTier = tierKey;

    document.querySelectorAll(".btn").forEach(btn => btn.classList.remove("active"));
    btnEl.classList.add("active");

    document.getElementById("tier-display").textContent = "Level " + tierKey.replace("-", " - ");

    renderRecipeOptions();
    renderFishing();
    renderMacros();
    renderContent();
    document.getElementById("recipe-result").classList.add("hidden");
}

// ===== RECEPTEN DROPDOWN =====
function renderRecipeOptions() {
    const select = document.getElementById("recipe-select");
    select.innerHTML = '<option value="">-- Kies een item --</option>';
    gameData[currentTier].recipes.forEach((recipe, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = recipe.name;
        select.appendChild(option);
    });
}

function loadRecipe() {
    const select = document.getElementById("recipe-select");
    const index = select.value;
    const resultBox = document.getElementById("recipe-result");

    if (index === "") {
        resultBox.classList.add("hidden");
        return;
    }

    const recipe = gameData[currentTier].recipes[index];
    document.getElementById("recipe-name").textContent = recipe.name;

    const list = document.getElementById("ingredients-list");
    list.innerHTML = "";
    recipe.ingredients.forEach(ing => {
        const row = document.createElement("tr");
        const badgeClass = ing.source === "Verzamelen" || ing.source === "Delven" ? "badge-gather" : "badge-vendor";
        row.innerHTML = `
            <td>${ing.material}</td>
            <td>${ing.qty}</td>
            <td><span class="${badgeClass}">${ing.source}</span></td>
            <td>${ing.location}</td>
        `;
        list.appendChild(row);
    });

    resultBox.classList.remove("hidden");
}

// ===== VISSERIJ TABEL =====
function renderFishing() {
    const list = document.getElementById("fishing-list");
    list.innerHTML = "";
    gameData[currentTier].fishing.forEach(fish => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${fish.name}</td>
            <td>${fish.level}</td>
            <td>${fish.bait}</td>
            <td>${fish.location}</td>
        `;
        list.appendChild(row);
    });
}

// ===== MACRO'S =====
function renderMacros() {
    const container = document.getElementById("macro-container");
    container.innerHTML = "";
    gameData[currentTier].macros.forEach(macro => {
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="macro-title">${macro.title}</div>
            <div class="macro-box">${macro.text}</div>
        `;
        container.appendChild(div);
    });
}

// ===== DUNGEONS / CONTENT =====
function renderContent() {
    const container = document.getElementById("content-container");
    container.innerHTML = "";
    gameData[currentTier].content.forEach(item => {
        const div = document.createElement("div");
        div.className = "content-block";
        div.innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
        container.appendChild(div);
    });
}

// ===== OPSTARTEN =====
window.onload = function () {
    renderRecipeOptions();
    renderFishing();
    renderMacros();
    renderContent();
};