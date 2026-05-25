import Cart from '../models/Cart.js'

import Product from '../models/Product.js'


// GET CART

export const getCart =
  async (req, res) => {

    try {

      const cart =
        await Cart.findOne({
          user: req.user.id,
        }).populate(
          'items.product'
        )

      if (!cart) {

        return res.json({
          items: [],
          totalAmount: 0,
        })
      }

      // CALCULATE TOTAL

      let totalAmount = 0

      cart.items.forEach(
        (item) => {

          totalAmount +=

            item.price *
            item.quantity

        }
      )

      res.json({
        cart,
        totalAmount,
      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// INCREASE QUANTITY

export const increaseQuantity =
  async (req, res) => {

    try {

      const {
        productId,
        size,
        color,
      } = req.body

      const cart =
        await Cart.findOne({
          user: req.user.id,
        })

      if (!cart) {

        return res.status(404).json({
          message:
            'Cart not found',
        })
      }

      const item =
        cart.items.find(
          (i) =>

            i.product.toString() ===
            productId &&

            i.size === size &&

            i.color === color
        )

      if (item) {

        item.quantity += 1
      }

      await cart.save()

      res.json(cart)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// DECREASE QUANTITY

export const decreaseQuantity =
  async (req, res) => {

    try {

      const {
        productId,
        size,
        color,
      } = req.body

      const cart =
        await Cart.findOne({
          user: req.user.id,
        })

      if (!cart) {

        return res.status(404).json({
          message:
            'Cart not found',
        })
      }

      const item =
        cart.items.find(
          (i) =>

            i.product.toString() ===
            productId &&

            i.size === size &&

            i.color === color
        )

      if (item) {

        item.quantity -= 1

        // REMOVE ITEM IF 0

        if (
          item.quantity <= 0
        ) {

          cart.items =
            cart.items.filter(
              (i) =>

                !(

                  i.product.toString() ===
                  productId &&

                  i.size === size &&

                  i.color === color
                )
            )
        }
      }

      await cart.save()

      res.json(cart)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// ADD TO CART

export const addToCart =
  async (req, res) => {

    try {

      const {
        productId,
        quantity,
        size,
        color,
        price,
      } = req.body


      // VALIDATION

      if (
        !size ||
        !color
      ) {

        return res.status(400).json({
          message:
            'Please select variant',
        })
      }


      // FIND PRODUCT

      const product =
        await Product.findById(
          productId
        )

      if (!product) {

        return res.status(404).json({
          message:
            'Product not found',
        })
      }


      // CHECK VARIANT EXISTS

      const variant =
        product.variants.find(
          (v) =>

            v.size === size &&

            v.color === color
        )

      if (!variant) {

        return res.status(400).json({
          message:
            'Variant not found',
        })
      }


      // CHECK STOCK

      if (
        variant.stock <
        quantity
      ) {

        return res.status(400).json({
          message:
            'Insufficient stock',
        })
      }


      // FIND USER CART

      let cart =
        await Cart.findOne({
          user: req.user.id,
        })


      // CREATE CART

      if (!cart) {

        cart = new Cart({

          user:
            req.user.id,

          items: [],
        })
      }


      // CHECK EXISTING VARIANT

      const existingItem =
        cart.items.find(
          (item) =>

            item.product.toString() ===
            productId &&

            item.size === size &&

            item.color === color
        )


      if (existingItem) {

        existingItem.quantity +=
          quantity || 1

      } else {

        cart.items.push({

          product:
            productId,

          size,

          color,

          price,

          quantity:
            quantity || 1,
        })
      }

      await cart.save()

      await cart.populate(
        'items.product'
      )

      res.status(200).json(cart)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }