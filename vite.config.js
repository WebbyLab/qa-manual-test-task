import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { products, categories } from './src/data/products.js'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), 'public')

function sendJson(res, status, payload, delay = 400) {
  setTimeout(() => {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(payload))
  }, delay)
}

function handleProducts(req, res, next) {
  if (req.method !== 'GET') {
    return next()
  }

  const path = req.url.split('?')[0].replace(/^\/+|\/+$/g, '')

  if (!path) {
    sendJson(res, 200, products)
    return
  }

  const product = products.find((p) => String(p.id) === path)
  if (product) {
    sendJson(res, 200, product)
  } else {
    sendJson(res, 404, { error: 'Product not found' })
  }
}

function handleCategories(req, res, next) {
  if (req.method !== 'GET') {
    return next()
  }
  sendJson(res, 200, categories)
}

function handleOrder(req, res, next) {
  if (req.method !== 'POST') {
    return next()
  }

  let raw = ''
  req.on('data', (chunk) => {
    raw += chunk
  })
  req.on('end', () => {
    let form = {}
    try {
      form = JSON.parse(raw || '{}')
    } catch {
      form = {}
    }

    const address = (form.customer && form.customer.address) || form.address

    setTimeout(() => {
      res.setHeader('Content-Type', 'application/json')
      if (!address || !address.trim()) {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'Address is required' }))
      } else {
        res.statusCode = 200
        res.end(JSON.stringify({ ok: true }))
      }
    }, 1200)
  })
}

function handleImages(req, res, next) {
  const file = req.url.split('?')[0].replace(/^\/+/, '')
  if (existsSync(join(publicDir, 'images', file))) {
    return next()
  }
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'no-store')
  res.end('Not Found')
}

function registerApi(server) {
  server.middlewares.use('/api/products', handleProducts)
  server.middlewares.use('/api/categories', handleCategories)
  server.middlewares.use('/api/order', handleOrder)
  server.middlewares.use('/images', handleImages)
}

function mockApi() {
  return {
    name: 'mock-api',
    configureServer: registerApi,
    configurePreviewServer: registerApi,
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockApi()],
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
})
