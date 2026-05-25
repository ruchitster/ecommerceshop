import express from 'express'

import {
  register,
  login,
  adminLogin,
  getUsers,
  deleteUser,
  toggleBlockUser,
} from '../controllers/authController.js'

import authMiddleware from '../middleware/authMiddleware.js'

import adminMiddleware from '../middleware/adminMiddleware.js'

const router =
  express.Router()


// USER REGISTER
router.post(
  '/register',
  register
)


// USER LOGIN
router.post(
  '/login',
  login
)


// ADMIN LOGIN
router.post(
  '/admin/login',
  adminLogin
)


// ADMIN GET USERS
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  getUsers
)


// DELETE USER
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  deleteUser
)


// BLOCK USER
router.put(
  '/block/:id',
  authMiddleware,
  adminMiddleware,
  toggleBlockUser
)

export default router