const fs = require('fs');

const htmlContent = fs.readFileSync('./index.html', 'utf-8');
const functionMatch = htmlContent.match(/function getPicks\(\)\{[\s\S]*?catch\(e\)\{ return \[\]; \}\s*\}/);

let extractedFunction;
if (functionMatch) {
  // We rename it in the eval scope to avoid conflict, or just let eval return the function.
  // The simplest way to evaluate a function definition safely is to wrap it in parens and return it.
  const codeToEval = `(function() { return ${functionMatch[0]}; })()`;
  extractedFunction = eval(codeToEval);
}

const LS_PICKS = 'sterlingDugout_picks';

describe('getPicks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return empty array when localStorage is empty', () => {
    expect(extractedFunction()).toEqual([]);
  });

  it('should return empty array on invalid JSON', () => {
    localStorage.setItem(LS_PICKS, '{invalid json}');
    expect(extractedFunction()).toEqual([]);
  });

  it('should return valid data when localStorage has valid JSON', () => {
    localStorage.setItem(LS_PICKS, JSON.stringify(['pick1', 'pick2']));
    expect(extractedFunction()).toEqual(['pick1', 'pick2']);
  });
});
