# 🌿 Sterling Dugout

Welcome to the **Sterling Dugout**, the ultimate local sports dashboard blending real-time Chicago & Illinois professional/college sports, Sterling High School local feeds, and a very special "Terpene Advisor" featuring a positive rotating Good News Ticker—all wrapped in a sleek, mobile-optimized dark mode UI.

![Sterling Dugout Preview](assets/cannabis-v4-header.png)

## ✨ Features

- **Live Illinois Sports Feeds**: Automated real-time tracking for the Cubs, White Sox, Bulls, Bears, Blackhawks, Fire, AND major Illinois College Basketball programs (Illinois, Northwestern, DePaul, Loyola, Illinois State, Bradley, etc). No refresh needed—scores update smoothly in the background.
- **Historical Date Navigation**: Seamlessly navigate back in time to view yesterday's scores or jump into the future to preview tomorrow's matchups using the fluid `◄ Today ►` dashboard scroller.
- **Sterling Golden Warriors Live Feed**: Directly pulls in score updates for Sterling High School using the native ScoreStream widget. 
- **CJ vs Jesse Leaderboard**: A prediction tracker saved locally so rivalries never die. Pick the winner of the daily featured matchup, lock it in, and see who takes the crown. The dashboard dynamically features Major Events (Super Bowl, World Series, Stanley Cup, Final Four, NIT, etc) alongside your hometown teams.
- **Terpene Advisor & Good News**: Because sometimes sports are stressful. The dashboard analyzes current game states (Win/Loss/Pending) and recommends specific cannabis strains and terpene profiles to match the mood (e.g., "Calm Mode" for a punishing loss, "Celebrate Mode" for a walk-off win). It also features a rotating ticker of positive, evergreen cannabis facts and news!
- **Sauk Valley Lore**: A rotating local history widget spitting fun facts about Sterling, Rock Falls, and the beautiful Sauk Valley.
- **Responsive "Glassmorphism" UI**: Built with a custom moody aesthetic, featuring gorgeous drop-shadowed cannabis icons, gold glows, and smooth CSS layouts that look incredible on mobile or desktop.

## 🚀 Getting Started

No build steps are required. This dashboard is built on pure HTML, CSS, and vanilla Javascript.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/sterling-dugout.git
   ```
2. **Open the Dashboard**:
   Simply open `index.html` in your favorite modern browser. That's it!

   *(If you are developing locally, you can use a local static server like `npx serve` or python's `http.server` for the best performance).*

## 🛠️ Built With

- **HTML5 & Vanilla CSS3**: No heavy CSS frameworks. Full custom CSS variables and grid layouts.
- **Vanilla JavaScript**: Handles state, DOM manipulation, persistent `localStorage` picking, and interval fetching.
- **ESPN Hidden API**: Powers the live professional & college sports scoreboard data.
- **ScoreStream**: Powers the local Sterling High School feed.

## 📂 File Structure

- `index.html`: The core dashboard, containing all CSS styling and Javascript logic. It's built as a single, easily deployable file.
- `assets/`: Contains the portrait avatars for CJ & Jesse and the custom UI icons.

## 📝 Data Storage Notice

The CJ vs Jesse Leaderboard uses `localStorage` to save your running seasonal stats indefinitely. Since `localStorage` is tied directly to your specific browser on your specific device, **you will both need to make your picks on the same shared base-station device** (like a living room tablet or laptop) for the stats to automatically combine and compete locally on the same screen! 

## 📝 License
This project is built for fun, local pride, and personal use. Feel free to fork and customize for your own hometown or rivalries!
