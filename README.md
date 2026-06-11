# WebbyLab-Shop

A simple React online-store app: product catalog, product page, and a checkout
form. There is no backend — mock data from a JS file is used.

## Tech stack

- React 19 + Vite
- React Router
- CSS Modules
- Cart state via React Context (no Redux)

## Structure

- `/` — product catalog (search, category filter, sorting)
- `/product/:id` — single product page
- `/checkout` — checkout form

Mock product data lives in `src/data/products.js`.

## Requirements

- Node.js 20.19+ or 22.12+ (for local run)
- npm
- Docker (for running in a container) — optional

## Running locally

```bash
npm install
npm start
```

The app will be available at http://localhost:3000

Other commands:

```bash
npm run build     # build the production version into dist/
npm run preview   # preview the built version locally (http://localhost:3000)
npm run lint      # run ESLint
```

> The mock API (`/api/products`, `/api/products/:id`, `/api/categories`,
> `/api/order`) runs through middleware in `vite.config.js` and is available both
> in `npm start` mode and in `npm run preview`.

## Running in Docker

Build the image and run the container:

```bash
docker build -t webbylab-shop .
docker run --rm -p 3000:3000 webbylab-shop
```

Or with Docker Compose:

```bash
docker compose up --build
```

The app will be available at http://localhost:3000

Inside the container `npm run build` runs first, then the app is served with
`npm run preview` (the Vite preview server together with the mock API).
