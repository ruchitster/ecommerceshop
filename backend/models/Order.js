import mongoose from 'mongoose'

const orderSchema =
  new mongoose.Schema(

    {

      user: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'User',

        required: true,
      },


      items: [

        {

          product: {

            type:
              mongoose.Schema.Types.ObjectId,

            ref: 'Product',

            required: true,
          },


          // VARIANT DETAILS

          size: {

            type: String,

            required: true,
          },

          color: {

            type: String,

            required: true,
          },


          // PRICE AT ORDER TIME

          price: {

            type: Number,

            required: true,
          },


          quantity: {

            type: Number,

            required: true,
          },

        },

      ],


      shippingAddress: {

        fullName: String,

        phone: String,

        address: String,

        city: String,

        postalCode: String,
      },


      totalAmount: {

        type: Number,

        required: true,
      },


      orderStatus: {

        type: String,

        enum: [

          'Pending',

          'Processing',

          'Shipped',

          'Delivered',
        ],

        default: 'Pending',
      },

    },

    {
      timestamps: true,
    }
  )

const Order =
  mongoose.model(
    'Order',
    orderSchema
  )

export default Order