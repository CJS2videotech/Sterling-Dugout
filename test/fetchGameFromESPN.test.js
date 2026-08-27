const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('fetchGameFromESPN error paths', () => {
  beforeEach(() => {
    const scriptContent = html.match(/<script>([\s\S]*?)<\/script>/)[1];

    const fetchGameMatch = scriptContent.match(/(async function fetchGameFromESPN\([\s\S]*?\n\})/);
    let fetchGameCode = fetchGameMatch[1];

    global.SPORT_MAP = { mlb: { sport: 'baseball', league: 'mlb' } };
    global.ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports';

    global.fetchGameFromESPN = eval('(' + fetchGameCode.replace('async function fetchGameFromESPN', 'async function') + ')');

    global.fetch = jest.fn();

    // Mock console.error to avoid noisy test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns null and logs error on network failure', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    const result = await global.fetchGameFromESPN('mlb', '12345');

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Failed to resolve past pick', expect.any(Error));
  });

  it('returns null and logs error when response json parsing fails', async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn().mockRejectedValue(new Error('SyntaxError: Unexpected token'))
    });

    const result = await global.fetchGameFromESPN('mlb', '12345');

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Failed to resolve past pick', expect.any(Error));
  });

  it('returns null when JSON structure is missing header.competitions', async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ header: {} }) // Missing competitions
    });

    const result = await global.fetchGameFromESPN('mlb', '12345');

    expect(result).toBeNull();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('returns correct data when JSON structure is valid', async () => {
    const mockCompetitions = [{ status: { type: { name: 'STATUS_FINAL' } } }];
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        header: {
          competitions: mockCompetitions
        }
      })
    });

    const result = await global.fetchGameFromESPN('mlb', '12345');

    expect(result).toEqual({
      competitions: mockCompetitions,
      status: mockCompetitions[0].status
    });
    expect(console.error).not.toHaveBeenCalled();
  });
});
