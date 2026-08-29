# Abdullah Al Muaz - Portfolio Application

Welcome to the interactive portfolio of Abdullah Al Muaz. This project is a highly dynamic, dual-themed web application built with the **MERN stack**, **Next.js**, and **Framer Motion**. It is designed to act as a live demonstration of advanced front-end capabilities, prioritizing both performance and visual storytelling.

## 🚀 Live Demo

[View Live Portfolio](#) *(Replace with Vercel URL upon deployment)*

## ✨ Key Features & Architecture

This application goes beyond a standard resume, featuring a robust **"Day/Night" thematic architecture** that fundamentally transforms the user interface, animations, and data visualization based on the selected mode.

### Theme Engine
- **FOUC Prevention:** An inline script runs synchronously before React hydration to read `localStorage` preferences and apply the correct theme instantly, eliminating the "Flash of Unstyled Content".
- **The "Horizon Switch":** A dynamic `<ThemeToggle>` component featuring a continuous sky-to-space gradient track and a spring-physics sliding thumb.
- **Optimized Dynamic Backgrounds:** Selectively mounts active background components (`DayVision` or `NightVision`) using `AnimatePresence` to crossfade gracefully, ensuring heavy animations are processed only when visible to optimize GPU performance.

### Interactive Components

#### Hero & Biography
- **Typing Effect:** A custom `useTypingEffect` hook types out the developer's name organically with a blinking cursor.
- **Thematic Avatar:** A CSS-only `ThreeDCharacter` placeholder system that transitions from a frosted glass card in Day mode to a dark terminal display in Night mode.

#### Skills (`Skills.jsx`)
- **Day Mode ("Kite String"):** Skills sway gently as badges hanging from a kite string.
- **Night Mode ("Satellite Orbit"):** Skills orbit dynamically around a central hub, resembling a planetary system.

#### Project Showcase (`Projects.jsx`)
- **Mock UI Previews:** Pure CSS-based UI preview windows replacing static images. Frosted glass terminals for Day mode and deep-space monitors with scan lines for Night mode.

#### Achievements (`Achievements.jsx`)
- **Day Mode ("Hall of Clouds"):** Elegant banners hanging from stylized clouds, drifting in on scroll.
- **Night Mode ("Star Map"):** An interactive SVG constellation map where clicking glowing star nodes reveals achievement details.

## 🛠️ Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Frontend:** React 19
- **Styling:** Tailwind CSS 4, Custom CSS
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scrolling:** [Lenis](https://lenis.darkroom.engineering/)
- **Icons:** React Icons

## ⚙️ Local Development Setup

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Muazhere5/toggleDayNightPortfolio.git
   cd toggleDayNightPortfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Build and Deployment

This project is configured and optimized for automatic deployment on **Vercel**. 

- Standard `npm run build` and `npm start` commands are supported.
- Push changes to the `main` branch to trigger automatic redeployments if connected to Vercel.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
