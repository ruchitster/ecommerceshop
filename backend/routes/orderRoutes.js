import express from 'express'

import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} from '../controllers/orderController.js'

import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const router = express.Router()

// =======================
// USER ROUTES
// =======================

// PLACE ORDER
router.post('/', authMiddleware, placeOrder)

// GET USER ORDERS
router.get('/my-orders', authMiddleware, getMyOrders)

// GET SINGLE ORDER (USER OR ADMIN)
router.get('/:id', authMiddleware, getOrderById)


// =======================
// ADMIN ROUTES
// =======================

// GET ALL ORDERS (ADMIN ONLY)
router.get('/', authMiddleware, adminMiddleware, getAllOrders)

// UPDATE ORDER STATUS (ADMIN ONLY)
router.put('/:id', authMiddleware, adminMiddleware, updateOrderStatus)

export default router