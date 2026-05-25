import Razorpay from 'razorpay'

// CREATE PAYMENT ORDER
export const createOrder =
  async (req, res) => {

    try {

      // INITIALIZE RAZORPAY HERE
      const razorpay =
        new Razorpay({

          key_id:
            process.env
              .RAZORPAY_KEY_ID,

          key_secret:
            process.env
              .RAZORPAY_KEY_SECRET,
        })

      const { amount } =
        req.body

      const options = {

        amount:
          amount * 100,

        currency: 'INR',

        receipt:
          'order_receipt',
      }

      const order =
        await razorpay.orders.create(
          options
        )

      res.json(order)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })
    }
  }