const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

describe('Sterling Dugout Tests', () => {
    it('resolvePickResults should handle fetch rejection and log error', async () => {
        const dom = new JSDOM(html, {
            runScripts: 'dangerously',
            url: "http://localhost/"
        });
        const { window } = dom;

        // Wait for DOM to be ready and initialize promises to settle
        await new Promise(resolve => {
            if (window.document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
        // Give it a tiny bit more time for inline script promises to settle
        await new Promise(resolve => setTimeout(resolve, 50));

        // Set up a pending pick
        window.localStorage.setItem('sterlingDugout_picks', JSON.stringify([{
            date: '2023-10-10',
            who: 'cj',
            gameId: '123',
            sport: 'mlb',
            teamPicked: '16',
            teamName: 'Cubs',
            result: 'pending'
        }]));

        // Clear cache so it hits the fetch API path
        window.allGamesCache = {};

        // Mock fetch to reject
        window.fetch = jest.fn().mockImplementation(async (url) => {
            if (url.includes('/summary?event=')) {
                throw new Error('Network error');
            }
            return { json: async () => ({ events: [] }) };
        });

        // Spy on console.error
        jest.spyOn(window.console, 'error').mockImplementation(() => {});

        // Call the function under test
        await window.resolvePickResults();

        // Assert that the error was caught and logged
        expect(window.console.error).toHaveBeenCalledWith('Failed to resolve past pick', expect.any(Error));
        expect(window.console.error).toHaveBeenCalledTimes(1);
    });
});
