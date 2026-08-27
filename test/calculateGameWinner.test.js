const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('calculateGameWinner', () => {
  beforeAll(() => {
    // Extract calculateGameWinner from script tag
    const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];

    // Find the function definition
    const match = scriptContent.match(/(function calculateGameWinner\s*\([^)]*\)\s*{[\s\S]*?\n})/);
    const funcCode = match[1];

    // Evaluate it in the global scope so tests can use it
    global.calculateGameWinner = eval('(' + funcCode + ')');
  });

  afterAll(() => {
    delete global.calculateGameWinner;
  });

  it('returns home team id when home wins', () => {
    const comp = {
      competitors: [
        { homeAway: 'home', score: '5', team: { id: '10' } },
        { homeAway: 'away', score: '3', team: { id: '20' } }
      ]
    };
    expect(global.calculateGameWinner(comp)).toBe('10');
  });

  it('returns away team id when away wins', () => {
    const comp = {
      competitors: [
        { homeAway: 'home', score: '2', team: { id: '10' } },
        { homeAway: 'away', score: '8', team: { id: '20' } }
      ]
    };
    expect(global.calculateGameWinner(comp)).toBe('20');
  });

  it('returns null when it is a tie', () => {
    const comp = {
      competitors: [
        { homeAway: 'home', score: '4', team: { id: '10' } },
        { homeAway: 'away', score: '4', team: { id: '20' } }
      ]
    };
    expect(global.calculateGameWinner(comp)).toBeNull();
  });

  it('defaults to score 0 if score is missing and correctly calculates winner', () => {
    const comp = {
      competitors: [
        { homeAway: 'home', score: undefined, team: { id: '10' } }, // default to 0
        { homeAway: 'away', score: '2', team: { id: '20' } }
      ]
    };
    expect(global.calculateGameWinner(comp)).toBe('20');
  });

  it('falls back to competitor id if team object is missing id', () => {
    const comp = {
      competitors: [
        { homeAway: 'home', score: '7', id: '100', team: {} },
        { homeAway: 'away', score: '5', id: '200', team: {} }
      ]
    };
    expect(global.calculateGameWinner(comp)).toBe('100');
  });

  it('handles empty team object and score edge cases', () => {
    const comp = {
      competitors: [
        { homeAway: 'home', id: '100', team: {} }, // no score
        { homeAway: 'away', id: '200', team: {} }  // no score
      ]
    };
    expect(global.calculateGameWinner(comp)).toBeNull(); // 0 == 0 tie
  });
});
