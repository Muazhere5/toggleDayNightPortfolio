# Asset & Data Replacement Checklist

This document outlines all the dummy data, placeholders, and variables that need to be replaced with your real, production-ready personal data.

## Landing Page (Hero Section)
- **File:** `components/Landing.jsx`
- **Variable:** `TECH_TAGS` (Line 21)
  - **Needs:** Array of your core technology stack (e.g., `['ReactJS', 'Next.js', 'Node.js', ...]`)
- **Variable:** `'Muaz'` inside `useTypingEffect` (Line 172)
  - **Needs:** Your first name or full name for the typing animation.
- **Variable:** Subtitle / Bio paragraph (Lines 378-379)
  - **Needs:** A short personal biography or taglines for both Day and Night themes.

## Project Showcase Component
- **File:** `components/Projects.jsx`
- **Variable:** `PROJECTS` array (Line 51)
  - **Needs:** Array of your actual projects. For each project, you will need:
    - Title & Subtitle
    - Description
    - Array of Tech Tags
    - Live Demo URL (`liveUrl`)
    - GitHub URL (`githubUrl`)
    - Short label/emoji for the CSS preview (`previewIcon`, `previewLabel`)
- **Variable:** GitHub URL in the "View All on GitHub" button (Line 607)
  - **Needs:** Your personal GitHub profile URL.

## Skills & Socials Component
- **File:** `components/Skills.jsx`
- **Variable:** `SKILLS` array (Line 38)
  - **Needs:** Array of your actual technical skills (name, color hex code, and React Icon).
- **Variable:** `SOCIALS` array (Line 54)
  - **Needs:** Array of your social links (GitHub, LinkedIn, Twitter, Facebook, Email). Needs exact URLs replacing `https://github.com/yourusername`, `mailto:your@email.com`, etc.

## Achievements Component
- **File:** `components/Achievements.jsx`
- **Variable:** `ACHIEVEMENTS` array (Line 36)
  - **Needs:** Array of your real milestones, certifications, or awards. Each needs a title, description, icon, date, type (`education`, `project`, `skill`, `personal`, `award`), and group (for constellation drawing).
