const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('LocalStorage picks operations', () => {
  beforeEach(() => {
    const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];

    const code = scriptContent.match(/(const LS_PICKS = 'sterlingDugout_picks';[\s\S]*?function savePicks\(picks\)\{[\s\S]*?\n\})/)[1];

    eval(`
      ${code}
      global.LS_PICKS = LS_PICKS;
      global.getPicks = getPicks;
      global.savePicks = savePicks;
    `);

    // Mock localStorage
    const localStorageMock = (function() {
      let store = {};
      return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString();
        }),
        clear: jest.fn(() => {
          store = {};
        })
      };
    })();

    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  afterEach(() => {
    global.localStorage.clear();
    jest.restoreAllMocks();
  });

  describe('getPicks', () => {
    it('returns an empty array when localStorage is empty', () => {
      expect(global.getPicks()).toEqual([]);
      expect(global.localStorage.getItem).toHaveBeenCalledWith(global.LS_PICKS);
    });

    it('returns parsed picks when localStorage has valid JSON', () => {
      global.localStorage.setItem(global.LS_PICKS, JSON.stringify(['pick1', 'pick2']));
      expect(global.getPicks()).toEqual(['pick1', 'pick2']);
    });

    it('returns an empty array when localStorage contains invalid JSON (catches error)', () => {
      global.localStorage.setItem(global.LS_PICKS, 'invalid-json');
      expect(global.getPicks()).toEqual([]);
    });

    it('returns an empty array when JSON parses to null', () => {
      global.localStorage.setItem(global.LS_PICKS, JSON.stringify(null));
      expect(global.getPicks()).toEqual([]);
    });
  });

  describe('savePicks', () => {
    it('saves picks as a JSON string to localStorage', () => {
      const picksToSave = ['pick1', 'pick2'];
      global.savePicks(picksToSave);
      expect(global.localStorage.setItem).toHaveBeenCalledWith(global.LS_PICKS, JSON.stringify(picksToSave));
      expect(global.localStorage.getItem(global.LS_PICKS)).toBe(JSON.stringify(picksToSave));
    });
  });
});
