import mongoose from 'mongoose'

const reviewSchema =
  new mongoose.Schema(

    {

      user: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'User',

        required: true,

      },

      name: {
        type: String,
        required: true,
      },

      rating: {
        type: Number,
        required: true,
      },

      comment: {
        type: String,
        required: true,
      },

    },

    {
      timestamps: true,
    }
  )


// VARIANT SCHEMA

const variantSchema =
  new mongoose.Schema(

    {

      size: {

        type: String,

        required: true,

      },

      color: {

        type: String,

        required: true,

      },

      stock: {

        type: Number,

        required: true,

        default: 0,

      },

      price: {

        type: Number,

        required: true,

      },

    }

  )


const productSchema =
  new mongoose.Schema(

    {

      name: {

        type: String,

        required: true,

      },

      description: {

        type: String,

        required: true,

      },

      image: {

        type: String,

        required: true,

      },

      category: {

        type: String,

        required: true,

      },

      subcategory: {

        type: String,

        required: true,

      },

      featured: {

        type: Boolean,

        default: false,

      },


      // PRODUCT VARIANTS

      variants: {

        type: [variantSchema],

        default: [],

      },


      // REVIEWS

      reviews: [reviewSchema],


      rating: {

        type: Number,

        default: 0,

      },

      numReviews: {

        type: Number,

        default: 0,

      },

    },

    {

      timestamps: true,

    }
  )


const Product =
  mongoose.model(

    'Product',

    productSchema
  )

export default Product