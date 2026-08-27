const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('escapeHTML', () => {
  let escapeHTML;

  beforeAll(() => {
    // Extract script tag content
    const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];

    // Find the escapeHTML function
    const escapeHTMLMatch = scriptContent.match(/(function escapeHTML\([\s\S]*?\n\})/);
    const escapeHTMLCode = escapeHTMLMatch[1];

    // Evaluate the function
    escapeHTML = eval('(' + escapeHTMLCode + ')');
  });

  it('escapes & symbol', () => {
    expect(escapeHTML('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('escapes < and > symbols', () => {
    expect(escapeHTML('<div>')).toBe('&lt;div&gt;');
  });

  it('escapes single and double quotes', () => {
    expect(escapeHTML(`It's a "test"`)).toBe('It&#39;s a &quot;test&quot;');
  });

  it('escapes multiple occurrences of symbols', () => {
    expect(escapeHTML('<a href="test&id=1">link\'s</a>')).toBe('&lt;a href=&quot;test&amp;id=1&quot;&gt;link&#39;s&lt;/a&gt;');
  });

  it('returns unmodified input if not a string', () => {
    expect(escapeHTML(null)).toBeNull();
    expect(escapeHTML(undefined)).toBeUndefined();
    expect(escapeHTML(42)).toBe(42);
    expect(escapeHTML(true)).toBe(true);
    const obj = { key: 'value' };
    expect(escapeHTML(obj)).toBe(obj);
  });

  it('handles empty string', () => {
    expect(escapeHTML('')).toBe('');
  });

  it('handles string without special characters', () => {
    expect(escapeHTML('hello world')).toBe('hello world');
  });
});