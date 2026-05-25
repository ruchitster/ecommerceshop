import express from 'express'

import authMiddleware from '../middleware/authMiddleware.js'

import {
  downloadInvoice,
} from '../controllers/invoiceController.js'

const router =
  express.Router()

router.get(
  '/:id',
  authMiddleware,
  downloadInvoice
)

export default router