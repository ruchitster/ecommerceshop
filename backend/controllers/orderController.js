import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

/* =========================
   PLACE ORDER (FIXED)
========================= */
export const placeOrder = async (req, res) => {

  try {

    const { shippingAddress } = req.body

    // GET CART
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate('items.product')

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: 'Cart is empty',
      })
    }

    /* =========================
       STOCK VALIDATION (SAFE)
    ========================= */
    for (const item of cart.items) {

      const product = await Product.findById(item.product._id)

      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        })
      }

      const variant = product.variants.find((v) => {

        return (
          (!item.size || v.size === item.size) &&
          (!item.color || v.color === item.color)
        )
      })

      if (!variant) {
        return res.status(400).json({
          message: `Variant not found for ${product.name}`,
        })
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        })
      }
    }

    /* =========================
       CALCULATE TOTAL (SAFE)
    ========================= */
    const totalAmount = cart.items.reduce((total, item) => {

      const price =
        item.price ||
        item.product?.price ||
        item.product?.variants?.[0]?.price ||
        0

      return total + price * item.quantity

    }, 0)

    /* =========================
       CREATE ORDER
    ========================= */
    const order = await Order.create({

      user: req.user.id,

      items: cart.items.map((item) => ({

        product: item.product._id,

        size: item.size || null,
        color: item.color || null,

        price:
          item.price ||
          item.product?.price ||
          item.product?.variants?.[0]?.price ||
          0,

        quantity: item.quantity,
      })),

      shippingAddress,

      totalAmount,
    })

    /* =========================
       DEDUCT STOCK
    ========================= */
    for (const item of cart.items) {

      const product = await Product.findById(item.product._id)

      const variant = product.variants.find((v) => {

        return (
          (!item.size || v.size === item.size) &&
          (!item.color || v.color === item.color)
        )
      })

      if (variant) {
        variant.stock -= item.quantity
      }

      await product.save()
    }

    /* =========================
       CLEAR CART
    ========================= */
    cart.items = []
    await cart.save()

    res.status(201).json(order)

  } catch (error) {

    console.log('Place Order Error:', error)

    res.status(500).json({
      message: error.message,
    })
  }
}


/* =========================
   GET USER ORDERS (SAFE)
========================= */
export const getMyOrders = async (req, res) => {

  try {

    const orders = await Order.find({
      user: req.user.id,
    })
      .populate({
        path: 'items.product',
        select: 'name image price variants',
      })
      .sort({ createdAt: -1 })

    res.json(orders)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })
  }
}


/* =========================
   ADMIN - ALL ORDERS
========================= */
export const getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find()
      .populate('user', 'name email')
      .populate({
        path: 'items.product',
        select: 'name image price',
      })
      .sort({ createdAt: -1 })

    res.json(orders)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })
  }
}


/* =========================
   UPDATE ORDER STATUS
========================= */
export const updateOrderStatus = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    order.orderStatus = req.body.status

    const updatedOrder = await order.save()

    res.json(updatedOrder)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })
  }
}

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // USER SECURITY CHECK
    if (
      req.user.role !== 'admin' &&
      order.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}