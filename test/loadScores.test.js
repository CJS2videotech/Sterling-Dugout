const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('loadScores error path', () => {
  beforeEach(() => {
    // Override globals
    document.documentElement.innerHTML = html.toString();

    // Extract loadScores from script tag
    const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];

    // Find just the function we care about instead of evaluating everything
    const loadScoresMatch = scriptContent.match(/(async function loadScores\([\s\S]*?\n\})/);
    let loadScoresCode = loadScoresMatch[1];

    // Mock the environment
    global.SPORT_MAP = { mlb: { sport: 'baseball', league: 'mlb' } };
    global.CHICAGO_TEAMS = { mlb: [{ espnId: '112' }] };
    global.todayStr = () => '20231010';
    global.allGamesCache = {};
    global.dayOffset = 0;
    global.ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports';

    // Re-declare it globally so it's clean and safe from execution errors
    global.loadScores = eval('(' + loadScoresCode.replace('async function loadScores', 'async function') + ')');

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows error message when fetch fails and container is empty', async () => {
    const el = document.getElementById('scores-mlb');
    el.innerHTML = '';

    global.fetch.mockRejectedValue(new Error('Network error'));

    await global.loadScores('mlb');

    expect(el.innerHTML).toContain('Error loading scores');
  });

  it('shows error message when fetch fails and container shows Loading...', async () => {
    const el = document.getElementById('scores-mlb');
    el.innerHTML = '<div class="no-game glass">Loading...</div>';

    global.fetch.mockRejectedValue(new Error('Network error'));

    await global.loadScores('mlb');

    expect(el.innerHTML).toContain('Error loading scores');
  });

  it('does not overwrite existing scores when fetch fails', async () => {
    const el = document.getElementById('scores-mlb');
    const existingScores = '<div class="game-card">Cubs vs Cardinals</div>';
    el.innerHTML = existingScores;

    global.fetch.mockRejectedValue(new Error('Network error'));

    await global.loadScores('mlb');

    expect(el.innerHTML).toBe(existingScores);
  });

  it('handles gracefully when container does not exist', async () => {
    // Remove the element from DOM
    const el = document.getElementById('scores-mlb');
    if (el) el.remove();

    global.fetch.mockRejectedValue(new Error('Network error'));

    // Should not throw
    await expect(global.loadScores('mlb')).resolves.not.toThrow();
  });
});
