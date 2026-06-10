# AURACatalog — Product Catalog

A modern product catalog application built with React + Vite + Tailwind CSS v4, fetching data from [Fake Store API](https://fakestoreapi.com) and designed with an elegant Airbnb-inspired Clean White Canvas.

## Getting Started

Clone atau ekstrak proyek, lalu jalankan perintah berikut:

    cd auracatalog
    npm install
    npm run dev

App akan berjalan di **http://localhost:5173**

**Production Build:**

    npm run build
    npm run preview

---

## Features

### Core Features

| Feature | Description |
|---|---|
| **GET Request with Axios** | Fetches products and categories from `/products` using a dedicated Axios instance in `src/api.js` |
| **Loading Indicator** | Clean animated loading spinner (`animate-spin text-[#ff385c]`) centered on the page while data is loading |
| **Error Handling** | `try/catch` block handling network/server errors with an alert component and a functional "Try Again" button |
| **Server-Side Filter** | Categories fetched dynamically from API; filtering triggers direct backend queries for live server-side switching |
| **Real-time Search** | Interactive pill-shaped search bar that filters product titles instantly utilizing React `useMemo` optimization |
| **Product Detail Modal** | Fixed overlay modal (`backdrop-blur-sm`) displaying full product images, deep descriptions, rating scores, and pricing |
| **Responsive Grid** | Strict mobile-first breakpoints: 1 column on mobile, 2-3 columns on tablet, and 4 columns on large desktop layouts |

### Bonus Features

| Feature | Description |
|---|---|
| **Real Pagination** | Dividers that split the catalog into precise page segments, fully synchronized with search inputs and categories |
| **Add to Cart View** | Instant internal view navigation switching via state (`currentView`) supporting robust product quantity adjustments |
| **Quantity Stepper** | Interactive `+` and `-` counter buttons in the cart view allowing dynamic real-time shopping quantity updates |
| **Data Persistence** | Seamless `localStorage` binding keeping cart payloads and wishlist heart tallies intact across page refreshes |

### Additional UI Features

| Feature | Description |
|---|---|
| **Clean White Canvas** | Premium minimalist palette using pure white (`#ffffff`), charcoal text (`#222222`), and ultra-thin borders (`#dddddd`) |
| **Rausch Accent Voltage**| Single-accent token implementation using exclusive Airbnb Rausch (`#ff385c`) for all active states and CTA inputs |
| **Scrollable Category Strip**| Horizontal slide-and-scroll swipe strip for category selection pills on mobile viewports to prevent layout wrapping |
| **Responsive Cart Stack**| Structural transformation that collapses rigid table elements into sleek stacked cards on mobile and small screens |

---

## Folder Structure

**src/**
- lib/
  - api.js
- App.jsx
- main.jsx
- index.css

*Note: In compliance with strict codebase rules, all sub-layout structures, modals, states, and client-side page toggles are neatly packaged inside the single unified file `src/App.jsx`.*

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Declarative UI library with centralized state hooks |
| Vite 5 / 6 | High-speed development server and production bundler |
| Tailwind CSS 4 | Next-gen utility-first framework using modern `@import "tailwindcss"` engine |
| Axios | Promise-based HTTP client handling asynchronous data streams cleanly |

---

## API Endpoints Used

| Endpoint | Method | Description |
|---|---|---|
| `/products` | GET | Fetch all available marketplace products |
| `/products/categories` | GET | Fetch unique list of product categories |
| `/products/category/{category}` | GET | Fetch server-filtered items by selected category tag |