const GEN_RANGES = {
    "1": { min: 1, max: 151 },
    "2": { min: 152, max: 251 },
    "3": { min: 252, max: 386 },
    "4": { min: 387, max: 493 },
    "5": { min: 494, max: 649 },
    "all": { min: 1, max: 649 }
};

// Elementos
const views = { game: document.getElementById('game-view'), dex: document.getElementById('gritodex-view') };
const navBtns = { game: document.getElementById('btn-game'), dex: document.getElementById('btn-view-gritodex') };
const optionsContainer = document.getElementById('options-container');
const playBtn = document.getElementById('play-btn');
const feedback = document.getElementById('feedback');
const message = document.getElementById('message');
const nextBtn = document.getElementById('next-btn');
const genSelect = document.getElementById('gen-select');
const statusLight = document.getElementById('status-light');
const gritodexList = document.getElementById('gritodex-list');
const countLabel = document.getElementById('count');
const sndSuccess = document.getElementById('snd-success');
const sndError = document.getElementById('snd-error');

let currentTarget = null;
let hasGuessed = false;
let cryAudio = null;

// --- LÓGICA DE PERSISTENCIA ---
function saveToGritodex(pkmn) {
    let dex = JSON.parse(localStorage.getItem('gritodex') || '[]');
    // Solo guardar si no existe ya
    if (!dex.find(item => item.id === pkmn.id)) {
        dex.push({ id: pkmn.id, name: pkmn.spanishName || pkmn.name, sprite: pkmn.sprite });
        // Ordenar por ID
        dex.sort((a, b) => a.id - b.id);
        localStorage.setItem('gritodex', JSON.stringify(dex));
    }
}

function renderGritodex() {
    const dex = JSON.parse(localStorage.getItem('gritodex') || '[]');
    countLabel.innerText = dex.length;
    gritodexList.innerHTML = dex.map(p => `
        <div class="gritodex-item">
            <img src="${p.sprite}" alt="${p.name}">
            <span>#${p.id} ${p.name}</span>
        </div>
    `).join('');
}

// --- LÓGICA DE NAVEGACIÓN ---
navBtns.game.onclick = () => {
    views.game.classList.remove('hidden');
    views.dex.classList.add('hidden');
    navBtns.game.classList.add('active');
    navBtns.dex.classList.remove('active');
};

navBtns.dex.onclick = () => {
    views.game.classList.add('hidden');
    views.dex.classList.remove('hidden');
    navBtns.dex.classList.add('active');
    navBtns.game.classList.remove('active');
    renderGritodex();
};

// --- LÓGICA DEL JUEGO ---
async function getPokemonInfo(id) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    return {
        id: data.id,
        name: data.name.toUpperCase(),
        cry: data.cries.latest || data.cries.legacy,
        sprite: data.sprites.front_default
    };
}

async function startNewRound() {
    hasGuessed = false;
    feedback.classList.add('hidden');
    statusLight.classList.add('loading-light');
    optionsContainer.innerHTML = '<p style="font-size:10px">CARGANDO...</p>';
    
    const { min, max } = GEN_RANGES[genSelect.value];
    const ids = [];
    while(ids.length < 5) {
        const id = Math.floor(Math.random() * (max - min + 1)) + min;
        if(!ids.includes(id)) ids.push(id);
    }

    try {
        const pokemons = await Promise.all(ids.map(id => getPokemonInfo(id)));
        currentTarget = pokemons[Math.floor(Math.random() * 5)];
        
        // Cargar nombre español del ganador
        const sRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${currentTarget.id}`);
        const sData = await sRes.json();
        currentTarget.spanishName = sData.names.find(n => n.language.name === "es")?.name.toUpperCase();

        cryAudio = new Audio(currentTarget.cry);
        renderOptions(pokemons);
        statusLight.classList.remove('loading-light');
    } catch (e) {
        optionsContainer.innerHTML = 'ERROR DE RED';
        statusLight.classList.remove('loading-light');
    }
}

function renderOptions(pokemons) {
    optionsContainer.innerHTML = pokemons.map(p => `
        <button class="option-btn" onclick="handleGuess(${p.id}, this)">
            <img src="${p.sprite}" class="pkmn-icon">
            <span>${p.name}</span>
        </button>
    `).join('');
}

function handleGuess(id, btn) {
    if (hasGuessed) return;
    hasGuessed = true;
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    if (id === currentTarget.id) {
        btn.classList.add('correct');
        message.innerText = `¡LOGRADO! ES ${currentTarget.spanishName || currentTarget.name}`;
        sndSuccess.play().catch(()=>{});
        saveToGritodex(currentTarget); // <--- GUARDAR EN LA GRITODEX
    } else {
        btn.classList.add('incorrect');
        message.innerText = `ERA ${currentTarget.spanishName || currentTarget.name}`;
        sndError.play().catch(()=>{});
        document.querySelectorAll('.option-btn').forEach(b => {
            // Un truco simple para marcar el correcto visualmente
            if(b.innerHTML.includes(currentTarget.sprite)) b.classList.add('correct');
        });
    }
    feedback.classList.remove('hidden');
}

playBtn.onclick = () => cryAudio?.play();
nextBtn.onclick = startNewRound;
genSelect.onchange = startNewRound;

startNewRound();
