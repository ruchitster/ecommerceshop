import express from 'express'

import {
  createOrder,
} from '../controllers/paymentController.js'

import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post(
  '/create-order',
  authMiddleware,
  createOrder
)

export default router