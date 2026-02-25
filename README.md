# LuminaStock

LuminaStock is a modern, responsive Inventory Management System built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui primitives, TanStack Table, React Hook Form + Zod, Zustand persistence, and sonner notifications.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Included Demo Data

- 8 inventory items (including Apple Magic Mouse `I000035611`)
- 4 suppliers (including `CRIF PHILIPPINES, INC.`)
- 4 customers (including `COASTAL PARADISE LEISURE INC.`)

Seed sources:

- `data/seed.json`
- `src/data/seed.json`

The app persists edits to browser `localStorage` through Zustand persistence (`luminastock-store`).

## Add More Data

1. Edit [`/Users/paulluiser/Documents/Inventory System Draft/data/seed.json`](/Users/paulluiser/Documents/Inventory%20System%20Draft/data/seed.json).
2. Keep objects aligned with [`/Users/paulluiser/Documents/Inventory System Draft/src/types/inventory.ts`](/Users/paulluiser/Documents/Inventory%20System%20Draft/src/types/inventory.ts).
3. Mirror updates to [`/Users/paulluiser/Documents/Inventory System Draft/src/data/seed.json`](/Users/paulluiser/Documents/Inventory%20System%20Draft/src/data/seed.json).
4. Clear browser localStorage for `luminastock-store` to reload updated seed data.

## Build

```bash
npm run build
```

A production build command is configured for Next.js 15.
