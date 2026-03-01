# ⚔️ Mini-Lineage Remastered

Mini-Lineage Remastered is a modern, high-performance rewrite of the classic Mini-Lineage RPG. Built with TypeScript and a focus on premium aesthetics, it revitalizes the core mechanics with modern web technologies.

## 🌟 Features

- **Dynamic Race System**: Choose between Humans, Orcs, Elves, and Dark Elves, each with unique stats and enemy behavior.
- **Modern UI/UX**: Dark mode by default with vibrant accents, glassmorphism, and responsive design.
- **Rebalanced Combat**: Meticulously tuned math for Adena, Experience, and Ambush odds.
- **Highscores**: Dynamic leaderboard tracking the legendary champions of the land.

## 🛠️ Technologies

- **Backend**: Node.js & Express.js
- **Language**: TypeScript (Type-safe everything)
- **Database**: MySQL 8+
- **Templating**: EJS (Embedded JavaScript)
- **Session**: express-session (Store-agnostic)

## 📦 Installation

1. **Clone & Install**:

   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the root directory based on `.env.example`

3. **Database Initialization**:
   Run the automated script to set up your tables and initial seeds:

   ```bash
   npm run db:init
   ```

## 🗄️ Database Management

We use a custom, lightweight seeding system for the remastered version.

- `npm run db:init`: Safe initialization. Creates tables and seeds data only if they don't exist. Useful for standard updates.
- `npm run db:fresh`: Full reset. Drops all managed tables and runs a clean install from `database/dump.sql`. **Use with caution!**

## 🚀 Execution

- **Development Mode**: runs with `nodemon` and `ts-node` for instant reloading.

  ```bash
  npm run dev
  ```
- **Production Build**: Compiles to pure JavaScript in the `dist` folder.

  ```bash
  npm run build
  npm start
  ```

## ⚖️ License

MIT License © 2026
