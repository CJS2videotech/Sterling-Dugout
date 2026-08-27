const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('isMajorEvent', () => {
  let isMajorEvent;

  beforeAll(() => {
    // Extract script tag content
    const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];

    // Find the isMajorEvent function
    const match = scriptContent.match(/(function isMajorEvent\([\s\S]*?\n\})/);
    const code = match[1];

    // Re-declare it for testing
    isMajorEvent = eval('(' + code.replace('function isMajorEvent', 'function') + ')');
  });

  const createEvent = (name, shortName, notes) => ({
    name: name || '',
    shortName: shortName || '',
    competitions: [
      {
        notes: notes
      }
    ]
  });

  it('identifies Super Bowl from event name', () => {
    const event = createEvent('Super Bowl LVIII', 'KC vs SF');
    expect(isMajorEvent(event)).toBe(true);
  });

  it('identifies World Series from shortName', () => {
    const event = createEvent('Game 1', 'World Series');
    expect(isMajorEvent(event)).toBe(true);
  });

  it('identifies Stanley Cup from notes headline', () => {
    const event = createEvent('Game 7', 'EDM vs FLA', [{ headline: 'Stanley Cup Final' }]);
    expect(isMajorEvent(event)).toBe(true);
  });

  it('identifies Championship from notes type', () => {
    const event = createEvent('Game 1', 'TEAM A vs TEAM B', [{ type: 'Championship' }]);
    expect(isMajorEvent(event)).toBe(true);
  });

  it('identifies NIT with spaces from event name', () => {
    const event = createEvent(' NIT ', 'Team A vs Team B');
    expect(isMajorEvent(event)).toBe(true);
  });

  it('does not identify random nit string without spaces', () => {
    // "furniture" contains "nit", but isMajorEvent checks for " nit "
    const event = createEvent('furniture', 'Team A vs Team B');
    expect(isMajorEvent(event)).toBe(false);
  });

  it('handles missing notes property safely', () => {
    const event = createEvent('Regular Game', 'REG', undefined);
    expect(isMajorEvent(event)).toBe(false);
  });

  it('handles notes without headline or type safely', () => {
    const event = createEvent('Regular Game', 'REG', [{ other: 'value' }]);
    expect(isMajorEvent(event)).toBe(false);
  });

  it('returns false for regular season games', () => {
    const event = createEvent('Chicago Bulls at Boston Celtics', 'CHI @ BOS', [{ headline: 'Regular Season' }]);
    expect(isMajorEvent(event)).toBe(false);
  });
});
