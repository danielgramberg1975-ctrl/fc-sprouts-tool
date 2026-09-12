// ===== STATE =====
let allRecipes = [];
let currentResults = [];
let selectedRecipe = null;

// ===== LOAD RECIPE DATA =====
async function loadRecipes() {
    try {
        const response = await fetch('data/recipes.json');
        if (!response.ok) throw new Error('Could not load recipes.json');
        allRecipes = await response.json();
        document.getElementById('recipe-count').textContent = allRecipes.length.toLocaleString('en-US');
        applyFilters();
    } catch (err) {
        document.getElementById('recipe-list').innerHTML =
            '<p class="no-results">Could not load recipe data. Make sure data/recipes.json exists and that you are viewing this through a local server (e.g. VSC Live Server), not by double-clicking index.html.</p>';
        console.error(err);
    }
}

// ===== FILTERING =====
function levelInRange(level, rangeKey) {
    if (rangeKey === 'all') return true;
    const [min, max] = rangeKey.split('-').map(Number);
    return level >= min && level <= max;
}

function applyFilters() {
    const classFilter = document.getElementById('class-filter').value;
    const levelFilter = document.getElementById('level-filter').value;
    const search = document.getElementById('search-box').value.trim().toLowerCase();

    currentResults = allRecipes.filter(r => {
        if (classFilter !== 'all' && r.class !== classFilter) return false;
        if (!levelInRange(r.level, levelFilter)) return false;
        if (search && !r.result.item.toLowerCase().includes(search)) return false;
        return true;
    });

    // Sort by level, then name
    currentResults.sort((a, b) => a.level - b.level || a.result.item.localeCompare(b.result.item));

    renderRecipeList();
}

// ===== RENDER LIST =====
function renderRecipeList() {
    const listEl = document.getElementById('recipe-list');
    const infoEl = document.getElementById('results-info');

    if (currentResults.length === 0) {
        listEl.innerHTML = '<p class="no-results">No recipes match your filters.</p>';
        infoEl.textContent = '';
        return;
    }

    infoEl.textContent = `${currentResults.length} matching recipe${currentResults.length === 1 ? '' : 's'}.`;

    listEl.innerHTML = '';
    currentResults.forEach(recipe => {
        const row = document.createElement('div');
        row.className = 'recipe-row';
        row.innerHTML = `
            <span class="recipe-row-name">${recipe.result.item}${recipe.result.amount > 1 ? ' x' + recipe.result.amount : ''}</span>
            <span class="recipe-row-tags">
                <span class="tag-class">${recipe.class}</span>
                <span class="tag-level">Lv ${recipe.level}${recipe.stars ? ' ★'.repeat(recipe.stars) : ''}</span>
            </span>
        `;
        row.addEventListener('click', () => selectRecipe(recipe, row));
        listEl.appendChild(row);
    });
}

// ===== SHOW SELECTED RECIPE =====
function selectRecipe(recipe, rowEl) {
    document.querySelectorAll('.recipe-row').forEach(r => r.classList.remove('selected'));
    rowEl.classList.add('selected');

    selectedRecipe = recipe;

    document.getElementById('recipe-name').textContent = recipe.result.item;
    document.getElementById('recipe-meta').textContent =
        `${recipe.class} · Level ${recipe.level}${recipe.stars ? ' (' + recipe.stars + ' star)' : ''} · ${recipe.result.amount} per craft`;

    document.getElementById('qty-input').value = recipe.result.amount; // default to one full craft
    renderIngredients();

    document.getElementById('recipe-result').classList.remove('hidden');
}

// ===== RENDER INGREDIENTS FOR THE CHOSEN QUANTITY =====
function renderIngredients() {
    if (!selectedRecipe) return;

    const qtyInput = document.getElementById('qty-input');
    let desiredAmount = parseInt(qtyInput.value, 10);
    if (!desiredAmount || desiredAmount < 1) desiredAmount = 1;
    qtyInput.value = desiredAmount;

    // How many times you need to actually run the craft to get at least the desired amount
    const craftsNeeded = Math.ceil(desiredAmount / selectedRecipe.result.amount);
    const totalProduced = craftsNeeded * selectedRecipe.result.amount;

    document.getElementById('craft-count-info').textContent =
        craftsNeeded > 1
            ? `= ${craftsNeeded} crafts (yields ${totalProduced})`
            : '';

    const list = document.getElementById('ingredients-list');
    list.innerHTML = '';
    selectedRecipe.ingredients.forEach(ing => {
        const row = document.createElement('tr');
        const totalNeeded = ing.amount * craftsNeeded;
        row.innerHTML = `<td>${ing.item}</td><td>${totalNeeded}</td>`;
        list.appendChild(row);
    });
}

// ===== FISHING (placeholder, real data coming next update) =====
function renderFishing() {
    const list = document.getElementById('fishing-list');
    list.innerHTML = '<tr><td colspan="4" class="no-results">Fishing data coming in the next update.</td></tr>';
}

// ===== MACROS (placeholder examples) =====
const macros = [
    { title: 'Basic Macro (Level 1-15)', text: '/ac "Basic Synthesis" <wait.3>\n/ac "Basic Touch" <wait.3>\n/ac "Basic Touch" <wait.3>\n/ac "Basic Synthesis" <wait.3>' },
    { title: 'Standard Macro (Level 16-30)', text: '/ac "Basic Synthesis" <wait.3>\n/ac "Standard Touch" <wait.3>\n/ac "Standard Touch" <wait.3>\n/ac "Basic Synthesis" <wait.3>' }
];

function renderMacros() {
    const container = document.getElementById('macro-container');
    container.innerHTML = '';
    macros.forEach(macro => {
        const div = document.createElement('div');
        div.innerHTML = `<div class="macro-title">${macro.title}</div><div class="macro-box">${macro.text}</div>`;
        container.appendChild(div);
    });
}

// ===== DUNGEONS / CONTENT (placeholder) =====
const content = [
    { title: 'Sastasha (Lv 15)', text: 'The first dungeon, unlocked via the main scenario quest.' },
    { title: 'The Bowl of Embers (Lv 20)', text: 'The first trial — a good introduction to group boss mechanics.' }
];

function renderContent() {
    const container = document.getElementById('content-container');
    container.innerHTML = '';
    content.forEach(item => {
        const div = document.createElement('div');
        div.className = 'content-block';
        div.innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
        container.appendChild(div);
    });
}

// ===== QUANTITY CONTROLS =====
document.getElementById('qty-input').addEventListener('input', renderIngredients);
document.getElementById('qty-minus').addEventListener('click', () => {
    const input = document.getElementById('qty-input');
    input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
    renderIngredients();
});
document.getElementById('qty-plus').addEventListener('click', () => {
    const input = document.getElementById('qty-input');
    input.value = (parseInt(input.value, 10) || 1) + 1;
    renderIngredients();
});

// ===== TAB SWITCHING =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));

        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.remove('hidden');
    });
});

// ===== EVENT LISTENERS =====
document.getElementById('class-filter').addEventListener('change', applyFilters);
document.getElementById('level-filter').addEventListener('change', applyFilters);
document.getElementById('search-box').addEventListener('input', applyFilters);

// ===== STARTUP =====
window.onload = function () {
    loadRecipes();
    renderFishing();
    renderMacros();
    renderContent();
};
