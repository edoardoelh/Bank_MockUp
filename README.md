# Bank MockUp — Finance Demo App

A high-fidelity personal finance management demo built with **React + Vite + TypeScript**, following the **M DE MAKER** design system.

## Getting Started

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```
The app will be available at `http://localhost:5173` with hot module reloading.

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## Features

- **Dashboard** — balance overview, income/expense chart, recent transactions
- **Transactions** — filterable transaction list with search and type toggle
- **Budget** — category budget tracking with progress bars
- **Reports** — monthly balance, category breakdown, annual trend table
- **Products** — product catalog with detail modals, contract forms (with diverse input controls), and cancellation flow

## Design System

Uses the M DE MAKER design tokens (`colors_and_type.css`, `components.css`):
- Warm paper background (e-ink aesthetic)
- Space Grotesk / Lora / JetBrains Mono typography
- Yellow primary accent, no dark mode, no blur shadows

## Stack

- React 18 + Vite + TypeScript
- CSS custom properties (design system tokens)
- Recharts for bar charts
- Lucide React for icons

## Intentional Bugs (marked `// BUG:` in source)

- **Profile**: registration date in incorrect format
- **Transactions**: one row with an incorrect negative amount
- **Budget**: one card missing percentage
- **Reports**: month filter not working

## Internationalization

UI available in English and Spanish (`en` / `es`).
