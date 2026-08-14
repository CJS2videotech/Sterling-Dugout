const fs = require('fs');
const path = require('path');

// Extract isMajorEvent from index.html
const htmlPath = path.resolve(__dirname, '../index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Use a regex to grab the isMajorEvent function
const functionRegex = /function isMajorEvent\s*\([\s\S]*?\n\}/;
const match = htmlContent.match(functionRegex);

if (!match) {
  throw new Error("Could not find isMajorEvent in index.html");
}

// Evaluate the function in the current context
let isMajorEvent;
eval(`isMajorEvent = ${match[0]}`);

describe('isMajorEvent', () => {
  it('should return true if name contains a keyword', () => {
    const event = {
      name: 'Super Bowl LVIII',
      shortName: 'KC vs SF',
      competitions: [{ notes: [] }]
    };
    expect(isMajorEvent(event)).toBe(true);
  });

  it('should return true if shortName contains a keyword', () => {
    const event = {
      name: 'Some Game',
      shortName: 'World Series Game 1',
      competitions: [{ notes: [] }]
    };
    expect(isMajorEvent(event)).toBe(true);
  });

  it('should return true if notes.headline contains a keyword', () => {
    const event = {
      name: 'Some Game',
      shortName: 'A vs B',
      competitions: [
        {
          notes: [{ headline: "NCAA Men's Basketball Tournament" }]
        }
      ]
    };
    expect(isMajorEvent(event)).toBe(true);
  });

  it('should return true if notes.type contains a keyword', () => {
    const event = {
      name: 'Some Game',
      shortName: 'A vs B',
      competitions: [
        {
          notes: [{ type: 'Stanley Cup Final' }]
        }
      ]
    };
    expect(isMajorEvent(event)).toBe(true);
  });

  it('should handle case insensitivity', () => {
    const event = {
      name: 'FINAL FOUR',
      shortName: 'UCONN vs PURDUE',
      competitions: [{ notes: [] }]
    };
    expect(isMajorEvent(event)).toBe(true);
  });

  it('should handle missing notes field', () => {
    const event = {
      name: 'Regular Game',
      shortName: 'A vs B',
      competitions: [{ }] // missing notes
    };
    expect(isMajorEvent(event)).toBe(false);
  });

  it('should handle empty notes array', () => {
    const event = {
      name: 'Regular Game',
      shortName: 'A vs B',
      competitions: [{ notes: [] }]
    };
    expect(isMajorEvent(event)).toBe(false);
  });

  it('should handle notes missing headline and type', () => {
    const event = {
      name: 'Regular Game',
      shortName: 'A vs B',
      competitions: [{ notes: [{ other: 'something' }] }]
    };
    expect(isMajorEvent(event)).toBe(false);
  });

  it('should return false for regular events', () => {
    const event = {
      name: 'Chicago Bulls vs Milwaukee Bucks',
      shortName: 'CHI vs MIL',
      competitions: [{ notes: [{ headline: 'Regular Season' }] }]
    };
    expect(isMajorEvent(event)).toBe(false);
  });
});
