# AURACatalog — Product Catalog

A modern product catalog application built with React + Vite + Tailwind CSS v4, fetching data from [Fake Store API](https://fakestoreapi.com) and designed with an elegant Airbnb-inspired Clean White Canvas.

---

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

## Features Implemented

| Feature | Description |
|---|---|
| **Airbnb Canvas Styling** | Premium minimalist palette using pure white (`#ffffff`), charcoal text (`#222222`), thin borders (`#dddddd`), and exclusive Rausch (`#ff385c`) accents. |
| **GET Request with Axios** | Fetches products and unique categories dynamically from server-side using a dedicated Axios instance in `src/api.js`. |
| **Loading & Error Handling** | Animated loading spinner (`animate-spin`) during data fetch, and a red alert box with a functional "Try Again" retry button if a network failure occurs. |
| **Real-time Search Bar** | Capsule-shaped search bar in the navbar that filters product titles instantly utilizing React `useMemo` optimization. |
| **Product Detail Modal** | Anti-break fixed overlay dialog (`backdrop-blur-sm`) that opens a floating card showing full images, rating stars, and deep descriptions without breaking the catalog layout. |
| **Real Pagination** | Clean client-side pagination system to navigate items smoothly, fully synchronized with active search terms and categories. |
| **In-App Cart View** | Instant single-page view shifting to the Shopping Cart page via internal state, bypassing the need for heavy router libraries. |
| **Quantity Stepper** | Interactive `+` and `-` counter adjustments inside the cart view allowing live quantity and subtotal calculations. |
| **Data Persistence** | Native `localStorage` binding keeping active shopping cart items and wishlist heart selections intact even after a full browser refresh. |
| **Mobile-First Layout** | Adaptive layout changing navbar links into vertical flows, making categories horizontally scrollable, and switching rigid cart layouts into stacked vertical components on mobile devices. |