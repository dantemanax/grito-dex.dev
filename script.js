const GEN_RANGES = [
    { id: "1", label: "GEN 1", min: 1, max: 151 },
    { id: "2", label: "GEN 2", min: 152, max: 251 },
    { id: "3", label: "GEN 3", min: 252, max: 386 },
    { id: "4", label: "GEN 4", min: 387, max: 493 },
    { id: "5", label: "GEN 5", min: 494, max: 649 },
    { id: "all", label: "TODAS", min: 1, max: 649 }
];

const appBody = document.getElementById('app-body');
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

// Controles Integrados de Gen (v6.1)
const genLabel = document.getElementById('gen-label');
const genPrev = document.getElementById('gen-prev');
const genNext = document.getElementById('gen-next');

let currentGenIndex = 0; // Por defecto Gen 1
let currentTarget = null;
let hasGuessed = false;
let cryAudio = null;

// MOTOR DE TEMAS: Forzamos la clase al body
function updateTheme(genId) {
