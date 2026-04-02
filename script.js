const GEN_RANGES = {
    "1": { min: 1, max: 151 },
    "2": { min: 152, max: 251 },
    "3": { min: 252, max: 386 },
    "4": { min: 387, max: 493 },
    "5": { min: 494, max: 649 },
    "all": { min: 1, max: 649 }
};

const appBody = document.getElementById('app-body');
const genSelect = document.getElementById('gen-select');
const optionsContainer = document.getElementById('options-container');
const playBtn = document.getElementById('play-btn');
const feedback = document.getElementById('feedback');
const message = document.getElementById('message');
const nextBtn = document.getElementById('next-btn');
const statusLight = document.getElementById('status-light');
const gritodexList = document.getElementById('gritodex-list');
const countLabel = document.getElementById('count');
const navBtns = { game: document.getElementById('btn-game'), dex: document.getElementById('btn-view-gritodex') };
const views = { game: document.getElementById('game-view'), dex: document.getElementById('gritodex-view') };

let currentTarget = null;
let hasGuessed = false;
let cryAudio = null;

// MOTOR DE TEMAS: Forzamos la clase al body
function applyTheme(value) {
    appBody.className = `theme-${value}`;
}

function saveToGritodex(pkmn) {
    let dex = JSON.parse(localStorage.getItem('gritodex') || '[]');
    if (!dex.find(item => item.id === pkmn.id)) {
        dex.push({ id: pkmn.id, name: pkmn.spanishName || pkmn.name, sprite: pkmn.sprite });
        dex.sort((a, b) => a.id - b.id);
        localStorage.setItem('gritodex', JSON.stringify(dex));
    }
}

function renderGritodex()
