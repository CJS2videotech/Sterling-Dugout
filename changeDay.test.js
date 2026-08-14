const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

describe('changeDay', () => {
  let dom;
  let window;
  let document;

  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    window = dom.window;
    document = window.document;

    window.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ events: [] }) }));
    window.refreshAll = jest.fn();
  });

  test('updates day-disp text to Yesterday for delta -1', () => {
    window.changeDay(-1);
    expect(document.getElementById('day-disp').innerText).toBe('Yesterday');
  });

  test('updates day-disp text to Tomorrow for delta 1', () => {
    window.changeDay(1);
    expect(document.getElementById('day-disp').innerText).toBe('Tomorrow');
  });

  test('updates day-disp text to Today for delta 0 (after changes)', () => {
    window.changeDay(1);
    window.changeDay(-1);
    expect(document.getElementById('day-disp').innerText).toBe('Today');
  });

  test('updates day-disp text for delta < -1', () => {
    window.changeDay(-2);
    expect(document.getElementById('day-disp').innerText).toBe('2 Days Ago');
  });

  test('updates day-disp text for delta > 1', () => {
    window.changeDay(2);
    expect(document.getElementById('day-disp').innerText).toBe('In 2 Days');
  });

  test('clears score grids and calls refreshAll', () => {
    // Set some dummy content
    ['mlb', 'nba', 'nfl', 'nhl', 'mls'].forEach(s => {
      document.getElementById('scores-' + s).innerHTML = 'Old Data';
    });

    window.changeDay(1);

    ['mlb', 'nba', 'nfl', 'nhl', 'mls'].forEach(s => {
      expect(document.getElementById('scores-' + s).innerHTML).toBe('<div class="no-game glass">Loading...</div>');
    });
    expect(window.refreshAll).toHaveBeenCalled();
  });

  test('does nothing if day-disp is null', () => {
    document.getElementById('day-disp').remove();
    // This should not throw an error
    expect(() => {
      window.changeDay(-1);
    }).not.toThrow();
  });
});
