import express from 'express'

import {
  addProduct,
  getProducts,
  deleteProduct,
  getProductById,
  updateProduct,
  createReview,
} from '../controllers/productController.js'

import authMiddleware from '../middleware/authMiddleware.js'

import adminMiddleware from '../middleware/adminMiddleware.js'

import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()


// ADD PRODUCT

router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  upload.single('image'),
  addProduct
)


// GET ALL PRODUCTS

router.get(
  '/',
  getProducts
)


// GET SINGLE PRODUCT

router.get(
  '/:id',
  getProductById
)


// UPDATE PRODUCT

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  upload.single('image'),
  updateProduct
)

router.post(
  '/:id/reviews',
  authMiddleware,
  createReview
)

// DELETE PRODUCT

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  deleteProduct
)

export default router