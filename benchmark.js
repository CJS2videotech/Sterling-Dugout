const { performance } = require('perf_hooks');

// Mock localStorage
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, value) => { store[key] = value; }
};

const LS_PICKS = 'sterlingDugout_picks';

global.localStorage.setItem(LS_PICKS, JSON.stringify([{ id: 1, team: 'Cubs' }, { id: 2, team: 'Bulls' }]));

// Current implementation
function getPicksCurrent(){
  try { return JSON.parse(localStorage.getItem(LS_PICKS)) || []; }
  catch(e){ return []; }
}

// Cached implementation
let cachedPicks = null;
function getPicksCached(){
  if (cachedPicks) return cachedPicks;
  try {
    cachedPicks = JSON.parse(localStorage.getItem(LS_PICKS)) || [];
    return cachedPicks;
  }
  catch(e){ return []; }
}

function savePicksCached(picks){
  cachedPicks = picks;
  localStorage.setItem(LS_PICKS, JSON.stringify(picks));
}

const iterations = 100000;

let start = performance.now();
for (let i = 0; i < iterations; i++) {
  getPicksCurrent();
}
let end = performance.now();
console.log(`Current: ${end - start} ms`);

start = performance.now();
for (let i = 0; i < iterations; i++) {
  getPicksCached();
}
end = performance.now();
console.log(`Cached: ${end - start} ms`);
