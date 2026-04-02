[README.md](https://github.com/user-attachments/files/26424999/README.md)
# 🌿 Sterling Dugout

Welcome to the **Sterling Dugout**, the ultimate local sports dashboard blending real-time Chicago professional sports, Sterling High School local feeds, and a very special "Sterling Lure" Cannabis Terpene Advisor—all wrapped in a sleek, mobile-optimized dark mode UI.

![Sterling Dugout Preview](assets/cannabis-leaf.png)

## ✨ Features

- **Live Chicago Sports Feeds**: Automated real-time tracking for the Cubs, White Sox, Bulls, Bears, Blackhawks, and Fire. No refresh needed—scores update every 60 seconds.
- **Sterling Golden Warriors Live Feed**: Directly pulls in score updates for Sterling High School using the native ScoreStream widget. 
- **CJ vs Jesse Leaderboard**: A prediction tracker saved locally so rivalries never die. Pick the winner, lock it in, and see who takes the crown.
- **Sterling Lure (Terpene Advisor)**: Because sometimes sports are stressful. The dashboard analyzes current game states (Win/Loss/Pending) and recommends specific cannabis strains and terpene profiles to match the mood (e.g., "Calm Mode" for a punishing loss, "Celebrate Mode" for a walk-off win).
- **Sauk Valley Lore**: A rotating local history widget spitting fun facts about Sterling, Rock Falls, and the beautiful Sauk Valley.
- **Responsive "Glassmorphism" UI**: Built with a custom moody aesthetic, featuring gorgeous drop-shadowed cannabis icons and smooth CSS layouts that look incredible on mobile or desktop.

## 🚀 Getting Started

No build steps are required. This dashboard is built on pure HTML, CSS, and vanilla Javascript.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/sterling-dugout.git
   ```
2. **Open the Dashboard**:
   Simply open `index.html` in your favorite modern browser. That's it!

   *(If you are developing locally, you can use a local static server like `npx serve` or VS Code Live Server for the best experience).*

## 🛠️ Built With

- **HTML5 & Vanilla CSS3**: No heavy CSS frameworks. Full custom CSS variables and grid layouts.
- **Vanilla JavaScript**: Handles state, DOM manipulation, and interval fetching.
- **ESPN Hidden API**: powers the live professional Chicago sports scoreboard data.
- **ScoreStream**: powers the local Sterling High School feed.

## 📂 File Structure

- `index.html`: The core dashboard, containing all CSS styling and Javascript logic. It's built as a single, easily deployable file.
- `assets/`: Contains the portrait images, standard icons, and the core primary translucent `cannabis-leaf.png`.

## 🌿 The "Sterling Lure" Engine
The Terpene Advisor is hardcoded using a custom algorithm bridging sports stats and cannabis culture.
When a Chicago team loses, the engine recommends strains like *Granddaddy Purple (Myrcene + Linalool)* to relax. When a team wins, it recommends *Green Crack (Myrcene + Limonene)* to celebrate. 

## 📝 License
This project is built for fun, local pride, and personal use. Feel free to fork and customize for your own hometown or rivalries!
