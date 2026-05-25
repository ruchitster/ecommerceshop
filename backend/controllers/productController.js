import Product from '../models/Product.js'


// ADD PRODUCT

export const addProduct =
  async (req, res) => {

    try {

      const {
        name,
        description,
        category,
        subcategory,
      } = req.body

      const image =
        req.file
          ? req.file.filename
          : ''

      // PARSE VARIANTS
      const variants =
        JSON.parse(
          req.body.variants
        )

      const product =
        await Product.create({

          name,
          description,
          category,
          subcategory,
          image,
          variants,

        })

      res.status(201).json(product)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// GET ALL PRODUCTS

export const getProducts =
  async (req, res) => {

    try {

      const {
        search,
        category,
        subcategory,
        sort,
        minPrice,
        maxPrice,
      } = req.query

      let query = {}

      // SEARCH
      if (search) {

        query.name = {
          $regex: search,
          $options: 'i',
        }
      }

      // CATEGORY
      if (category) {

        query.category = category
      }

      // SUBCATEGORY
      if (subcategory) {

        query.subcategory =
          subcategory
      }

      // PRICE FILTER
      if (
        minPrice ||
        maxPrice
      ) {

        query['variants.price'] = {}

        if (minPrice) {

          query[
            'variants.price'
          ].$gte =
            Number(minPrice)
        }

        if (maxPrice) {

          query[
            'variants.price'
          ].$lte =
            Number(maxPrice)
        }
      }

      let products =
        Product.find(query)

      // SORTING
      if (sort === 'low') {

        products =
          products.sort({
            'variants.price': 1,
          })
      }

      else if (
        sort === 'high'
      ) {

        products =
          products.sort({
            'variants.price': -1,
          })
      }

      else {

        products =
          products.sort({
            createdAt: -1,
          })
      }

      const finalProducts =
        await products

      res.json(finalProducts)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// GET SINGLE PRODUCT

export const getProductById =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        )

      if (!product) {

        return res.status(404).json({
          message:
            'Product not found',
        })
      }

      res.json(product)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// UPDATE PRODUCT

export const updateProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        )

      if (!product) {

        return res.status(404).json({
          message:
            'Product not found',
        })
      }

      product.name =
        req.body.name ||
        product.name

      product.description =
        req.body.description ||
        product.description

      product.category =
        req.body.category ||
        product.category

      product.subcategory =
        req.body.subcategory ||
        product.subcategory


      // UPDATE VARIANTS

      if (req.body.variants) {

        product.variants =
          JSON.parse(
            req.body.variants
          )
      }


      // UPDATE IMAGE

      if (req.file) {

        product.image =
          req.file.filename
      }

      const updatedProduct =
        await product.save()

      res.json(updatedProduct)

    } catch (error) {

      console.log(error)

      res.status(500).json({
        message:
          error.message,
      })
    }
  }

// CREATE REVIEW

export const createReview =
  async (req, res) => {

    try {

      const {
        rating,
        comment,
      } = req.body

      const product =
        await Product.findById(
          req.params.id
        )

      if (!product) {

        return res.status(404).json({
          message:
            'Product not found',
        })
      }

      // CHECK EXISTING REVIEW

      const alreadyReviewed =
        product.reviews.find(

          (review) =>

            review.user.toString() ===
            req.user.id
        )

      if (alreadyReviewed) {

        return res.status(400).json({
          message:
            'Product already reviewed',
        })
      }

      const review = {

        user:
          req.user.id,

        name:
          req.user.name,

        rating:
          Number(rating),

        comment,

      }

      product.reviews.push(
        review
      )

      product.numReviews =
        product.reviews.length

      product.rating =

        product.reviews.reduce(

          (total, item) =>

            item.rating + total,

          0
        ) /
        product.reviews.length

      await product.save()

      res.status(201).json({
        message:
          'Review Added',
      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// DELETE PRODUCT

export const deleteProduct =
  async (req, res) => {

    try {

      await Product.findByIdAndDelete(
        req.params.id
      )

      res.json({
        message:
          'Product deleted',
      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }