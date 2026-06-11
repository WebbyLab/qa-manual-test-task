# WebbyLab-Shop

Hi there! 👋 Welcome to the practical part of your assessment. You will be
testing a small online store application locally. **WebbyLab-Shop** features a
classic e-commerce flow: a product catalog, individual product pages, and a
checkout form.

## Tech stack

- React 19 + Vite
- React Router
- CSS Modules
- Cart state via React Context (no Redux)

## Requirements

- Node.js 20.19+ or 22.12+ (for local run)
- npm
- Docker (for running in a container)

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

## Contacts & Support

If you run into any issues during the setup, please reach out directly to the
company representative (your recruiter or hiring manager) who is communicating
with you regarding your application.
