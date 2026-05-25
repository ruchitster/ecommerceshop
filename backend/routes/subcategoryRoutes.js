import express from 'express'

import {
  createSubcategory,
  getSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
} from '../controllers/subcategoryController.js'

import authMiddleware from '../middleware/authMiddleware.js'

import adminMiddleware from '../middleware/adminMiddleware.js'

const router = express.Router()


router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  createSubcategory
)

router.get(
  '/',
  getSubcategories
)

router.get(
  '/:id',
  getSubcategoryById
)

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  updateSubcategory
)

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  deleteSubcategory
)

export default router