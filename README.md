<img width="1899" height="875" alt="image" src="https://github.com/user-attachments/assets/e9913048-466b-4ec1-84b6-eac44372567b" />

<h1>📸 Framerly - <a href="https://framerly-shot.vercel.app/"><b>🌐 Live Demo</b></a></h1>

<b>Plain screenshots walk into the studio. Portfolio shots walk out.</b>

<p>Framerly takes any screenshot and wraps it in a browser or device frame, sets the backdrop, casts the shadow, and hands back a polished image ready for your landing page, deck, or tweet.</p>

---

<picture><source media="(prefers-color-scheme: dark)" srcset="https://www.shieldcn.dev/badge/Language-TypeScript-3178C6.svg?logo=typescript&amp;variant=branded&amp;mode=dark"><img alt="Language · TypeScript" src="https://www.shieldcn.dev/badge/Language-TypeScript-3178C6.svg?logo=typescript&amp;variant=branded&amp;mode=light"></picture>
<img alt="Framework · Next.js" src="https://www.shieldcn.dev/badge/Framework-Next.js-000000.svg?logo=nextdotjs&variant=branded&mode=light" />
<img alt="Stack · React" src="https://www.shieldcn.dev/badge/Stack-React-61DAFB.svg?logo=react&variant=branded&mode=light" />
<img alt="Stack · Tailwind CSS" src="https://www.shieldcn.dev/badge/Stack-Tailwind_CSS-06B6D4.svg?logo=tailwindcss&variant=branded&mode=light" />
<img alt="Lint · ESLint" src="https://www.shieldcn.dev/badge/Lint-ESLint-4B32C3.svg?logo=eslint&variant=branded&mode=light" />
<a href="https://github.com/anupam-kumar-krishnan/framerly/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/anupam-kumar-krishnan/framerly?style=social" /></a>

## Table of Contents

- [Features](#features)
- [Sample](#sample)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Deploy Your Own](#deploy-your-own)
- [Upcoming Features](#features-in-progress)

## Features

- **Browser & device chrome** — Safari, Chrome, and bare frames, in light or dark, matched pixel-for-pixel to the real thing. <br>
- **Backdrops that don't fight the shot** — gradient, solid, or image backgrounds tuned to sit behind your screenshot. <br>
- **3D tilt and zoom** — angle the frame in space and dial the zoom until the composition feels intentional. <br>
- **Layered shadow and padding** — independent controls for shadow depth, corner radius, and canvas padding. <br>
- **Code snippet mode** — drop in a code block instead of a screenshot, with syntax themes, fonts, and window chrome. <br>
- **Layer management** — reorder and toggle visibility across everything on the canvas. <br>
- **Export at any size** — PNG, sized for a tweet, a deck slide, an App Store listing, or a 4K hero banner. <br>
- **75+ Backgrounds** — Choose from a curated library of backgrounds across multiple styles: Gradients, Patterns, macOS, Radial and Abstract. <br>
- **Angle Preview** — Instantly preview your design from every angle before exporting. <br>
- **Website Screenshot** — Generate a screenshot directly from a website link, no manual upload needed.

<img width="1895" height="792" alt="image" src="https://github.com/user-attachments/assets/b6a23d7c-b6c2-4a93-b64e-179cfd99b18b" />
<img width="1894" height="794" alt="image" src="https://github.com/user-attachments/assets/c4f67c3b-e718-49ab-901d-a06c228b73da" />


## Studio

<img width="1919" height="880" alt="image" src="https://github.com/user-attachments/assets/7eb664d0-8355-4617-a192-16c7e773c503" />


## Sample

<img width="1536" height="1152" alt="framerly-shot-sample" src="https://github.com/user-attachments/assets/49f33480-e0e6-4422-b5dd-17c90187f18c" />

## Tech Stack

| Layer     | Choice                                        | Badge                                                                                                                                                                                                                                                                                                                         |
| --------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org/)                | <img alt="Framework · Next.js" src="https://www.shieldcn.dev/badge/Next.js-000000.svg?logo=nextdotjs&variant=branded&mode=light" />                                                                                                                                                                                           |
| UI        | [React](https://react.dev/)                   | <img alt="Stack · React" src="https://www.shieldcn.dev/badge/React-61DAFB.svg?logo=react&variant=branded&mode=light" />                                                                                                                                                                                                       |
| Styling   | [Tailwind CSS](https://tailwindcss.com/)      | <img alt="Stack · Tailwind CSS" src="https://www.shieldcn.dev/badge/Tailwind_CSS-06B6D4.svg?logo=tailwindcss&variant=branded&mode=light" />                                                                                                                                                                                   |
| Language  | [TypeScript](https://www.typescriptlang.org/) | <picture><source media="(prefers-color-scheme: dark)" srcset="https://www.shieldcn.dev/badge/Language-TypeScript-3178C6.svg?logo=typescript&amp;variant=branded&amp;mode=dark"><img alt="TypeScript" src="https://www.shieldcn.dev/badge/TypeScript-3178C6.svg?logo=typescript&amp;variant=branded&amp;mode=light"></picture> |
| Linting   | [ESLint](https://eslint.org/)                 | <img alt="ESLint" src="https://www.shieldcn.dev/badge/ESLint-4B32C3.svg?logo=eslint&variant=branded&mode=light" />                                                                                                                                                                                                            |
| Hosting   | [Vercel](https://vercel.com/)                 | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anupam-kumar-krishnan/framerly)                                                                                                                                                                             |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.17 or later
- npm (bundled with Node)

No environment variables are required to run the project locally.

### Installation

```bash
git clone https://github.com/anupam-kumar-krishnan/framerly.git
cd framerly
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally. The studio itself lives at `/app`.

## How It Works

1. **Upload** a screenshot (or switch to code-snippet mode and paste a code block instead).
2. **Frame it** — pick a browser or device chrome, light or dark.
3. **Style the scene** — set the backdrop, tilt/zoom the frame in 3D, and dial in shadow, radius, and padding.
4. **Arrange layers** — reorder and toggle visibility for every element on the canvas.
5. **Export** — pick a size (social post, deck slide, App Store listing, 4K banner) and download a PNG.

## Project Structure

```
framerly/
├── public/          # Static assets
├── src/             # Application source (app router, components, studio logic)
├── next.config.ts   # Next.js configuration
├── eslint.config.mjs
├── postcss.config.mjs
└── tsconfig.json
```

## Deploy Your Own

Framerly is a standard Next.js app, so it deploys anywhere Next.js does. The live demo runs on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anupam-kumar-krishnan/framerly)

## Features In Progress

- [ ] Additional device/browser chrome presets
- [ ] Custom backdrop image uploads
- [ ] Saved already created designs
- [ ] Signup and Login
- [ ] Video Animations with presets
- [ ] Templates

Have an idea? [Open an issue](https://github.com/anupam-kumar-krishnan/framerly/issues).

---

<p align="center">© Built for people who ship screenshots.</p>
