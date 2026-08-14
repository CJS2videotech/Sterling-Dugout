const fs = require('fs');
const vm = require('vm');
const path = require('path');

let isChicagoTeam;

beforeAll(() => {
  const htmlPath = path.join(__dirname, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Extract script content
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!scriptMatch) {
    throw new Error('Could not find script tag in index.html');
  }
  const script = scriptMatch[1];

  // Create a minimal DOM environment for the script
  const sandbox = {
    document: {
      getElementById: () => ({ classList: { add: ()=>{}, remove: ()=>{} }, style: {}, innerHTML: '', appendChild: ()=>{} }),
      querySelectorAll: () => [],
    },
    fetch: () => Promise.resolve({ json: () => Promise.resolve({}) }),
    setInterval: () => {},
    setTimeout: () => {},
    localStorage: { getItem: () => null, setItem: () => {} }
  };

  vm.createContext(sandbox);
  vm.runInContext(script, sandbox);

  isChicagoTeam = sandbox.isChicagoTeam;
});

describe('isChicagoTeam', () => {
  it('should identify Chicago MLB teams by ID', () => {
    expect(isChicagoTeam('16', 'mlb')).toBe(true); // Cubs
    expect(isChicagoTeam('4', 'mlb')).toBe(true);  // White Sox
  });

  it('should identify Chicago NBA teams by ID', () => {
    expect(isChicagoTeam('4', 'nba')).toBe(true);  // Bulls
  });

  it('should identify Chicago NFL teams by ID', () => {
    expect(isChicagoTeam('3', 'nfl')).toBe(true);  // Bears
  });

  it('should identify Chicago NHL teams by ID', () => {
    expect(isChicagoTeam('4', 'nhl')).toBe(true);  // Blackhawks
  });

  it('should identify Chicago MLS teams by ID', () => {
    expect(isChicagoTeam('182', 'mls')).toBe(true);  // Fire
  });

  it('should identify Illinois NCAAMB teams by ID', () => {
    expect(isChicagoTeam('356', 'ncaamb')).toBe(true);  // Illinois
  });

  it('should return false for non-Chicago teams', () => {
    expect(isChicagoTeam('999', 'mlb')).toBe(false);
    expect(isChicagoTeam('10', 'nba')).toBe(false);
  });

  it('should handle integer IDs correctly', () => {
    expect(isChicagoTeam(16, 'mlb')).toBe(true);
    expect(isChicagoTeam(4, 'nba')).toBe(true);
    expect(isChicagoTeam(999, 'mlb')).toBe(false);
  });

  it('should handle invalid sports by throwing TypeError or returning falsy', () => {
    // The current implementation will throw a TypeError if the sport is not found in CHICAGO_TEAMS
    // return CHICAGO_TEAMS[sport].some(...) => undefined.some(...) throws
    expect(() => isChicagoTeam('16', 'invalidSport')).toThrow();
  });
});
