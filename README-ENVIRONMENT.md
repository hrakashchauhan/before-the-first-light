# Windows environment and first commands

Open PowerShell in:

`D:\Codex Game JAm\Chhath game`

Run:

```powershell
node -v
npm -v
git --version
```

The reported npm and Git versions are already:
- npm 11.17.0
- Git 2.55.0.windows.3

Node version remains to be checked. Use a current supported Node.js LTS release compatible with the current Vite release. If `node -v` fails, install Node.js LTS from the official Node.js website, close and reopen PowerShell, then verify again.

## Inspect before scaffolding

```powershell
Get-Location
Get-ChildItem -Force
```

If `package.json` already exists, inspect it. Do not run the Vite scaffold command over a working project.

## Create a Vite app only if this folder is empty

```powershell
npm create vite@latest . -- --template react-ts
npm install
```

## Install the MVP libraries

```powershell
npm install three @react-three/fiber@^9 @react-three/drei zustand zod gsap howler lucide-react
npm install -D @types/three
```

React Three Fiber v9 is the intended pairing for React 19. Keep stable compatible versions; do not install alpha/beta packages for the MVP.

## Add tests after the first renderer works

```powershell
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
npx playwright install chromium
```

## Useful scripts to add after inspecting package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  }
}
```

Merge scripts into the existing `package.json`; do not replace dependencies or scripts blindly.

## First run

```powershell
npm run dev
```

Open the local URL printed by Vite. Stop the server with `Ctrl+C`.

## Verified production preview

Run `npm run build`, then `npm run preview -- --host 127.0.0.1 --port 4173`. The verified local production preview is available at `http://127.0.0.1:4173/`. The project remains a local browser game and does not add a backend or cloud save service.

## Git checkpoint

```powershell
git status
git add .
git commit -m "chore: initialise before the first light project"
```

If Git asks for identity, configure your own name/email locally using `git config user.name` and `git config user.email`. Do not put secrets in Git.
