const fs = require('fs');
const path = require('path');

// Extract the `pad` function from index.html
const htmlPath = path.join(__dirname, '../index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Find the start of the function
const funcStartMatch = htmlContent.match(/function\s+pad\s*\([^)]*\)\s*\{/);

if (!funcStartMatch) {
  throw new Error("Could not find function pad(n) in index.html");
}

const startIndex = funcStartMatch.index;
let openBraces = 0;
let endIndex = -1;

for (let i = startIndex; i < htmlContent.length; i++) {
  if (htmlContent[i] === '{') {
    openBraces++;
  } else if (htmlContent[i] === '}') {
    openBraces--;
    if (openBraces === 0) {
      endIndex = i;
      break;
    }
  }
}

if (endIndex === -1) {
  throw new Error("Could not find the matching closing brace for function pad");
}

const padStr = htmlContent.substring(startIndex, endIndex + 1);

// Create a wrapper to return the function
const getPad = new Function(`return ${padStr}`);
const pad = getPad();

describe('pad utility', () => {
  it('should pad a single digit with a leading zero', () => {
    expect(pad(5)).toBe('05');
  });

  it('should pad zero with a leading zero', () => {
    expect(pad(0)).toBe('00');
  });

  it('should not modify a double digit number', () => {
    expect(pad(12)).toBe('12');
  });

  it('should not modify a triple digit number (boundary)', () => {
    expect(pad(123)).toBe('123');
  });

  it('should work with string numbers', () => {
    expect(pad('1')).toBe('01');
    expect(pad('12')).toBe('12');
  });

  it('should handle negative numbers correctly', () => {
    // String(-1).padStart(2,'0') returns "-1" (length is 2)
    expect(pad(-1)).toBe('-1');
  });

  it('should pad negative strings correctly if they are 1 char (though minus sign makes it 2)', () => {
    // "-5" has length 2, padStart(2, '0') does nothing
    expect(pad('-5')).toBe('-5');
  });

  it('should handle NaN or undefined gracefully based on JS coercion', () => {
    // String(undefined) -> "undefined" (length > 2)
    expect(pad(undefined)).toBe('undefined');
    // String(null) -> "null" (length > 2)
    expect(pad(null)).toBe('null');
    // String(NaN) -> "NaN" (length > 2)
    expect(pad(NaN)).toBe('NaN');
  });
});
