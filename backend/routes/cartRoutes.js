import express from 'express'

import {

  addToCart,

  getCart,

  increaseQuantity,

  decreaseQuantity,

} from '../controllers/cartController.js'

import authMiddleware from '../middleware/authMiddleware.js'


const router =
  express.Router()


console.log(
  'Cart Routes Loaded'
)


// ADD TO CART

router.post(

  '/add',

  authMiddleware,

  addToCart
)


// GET CART

router.get(

  '/',

  authMiddleware,

  getCart
)


// INCREASE QUANTITY

router.put(

  '/increase',

  authMiddleware,

  increaseQuantity
)


// DECREASE QUANTITY

router.put(

  '/decrease',

  authMiddleware,

  decreaseQuantity
)


export default router