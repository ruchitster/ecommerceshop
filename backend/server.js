import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import path from 'path'
import { fileURLToPath } from 'url'

import connectDB from './config/db.js'

// ROUTES
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import subcategoryRoutes from './routes/subcategoryRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import invoiceRoutes from './routes/invoiceRoutes.js'

dotenv.config()
connectDB()

const app = express()

// =======================
// MIDDLEWARES
// =======================

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// =======================
// ROOT ROUTE
// =======================

app.get('/', (req, res) => {
  res.send('API Running')
})

// =======================
// STATIC FILES
// =======================

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
)

// =======================
// API ROUTES
// =======================

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/subcategories', subcategoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/invoice', invoiceRoutes)

// =======================
// 404 HANDLER
// =======================

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  })
})

// =======================
// GLOBAL ERROR HANDLER
// =======================

app.use((err, req, res, next) => {
  console.error('Server Error:', err)

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  })
})

// =======================
// SERVER START
// =======================

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})