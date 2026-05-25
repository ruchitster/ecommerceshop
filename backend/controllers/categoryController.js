import Category from '../models/Category.js'


// CREATE CATEGORY

export const createCategory =
  async (req, res) => {

    try {

      const category =
        await Category.create({

          name: req.body.name,

        })

      res.status(201).json(
        category
      )

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      })
    }
  }


// GET CATEGORIES

export const getCategories =
  async (req, res) => {

    try {

      const categories =
        await Category.find()

      res.json(categories)

    } catch (error) {

      res.status(500).json({

        message:
          error.message,

      })
    }
  }


// GET CATEGORY BY ID

export const getCategoryById =
  async (req, res) => {

    try {

      const category =
        await Category.findById(
          req.params.id
        )

      res.json(category)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })
    }
  }


// UPDATE CATEGORY

export const updateCategory =
  async (req, res) => {

    try {

      const category =
        await Category.findById(
          req.params.id
        )

      if (!category) {

        return res.status(404).json({
          message:
            'Category not found',
        })
      }

      category.name =
        req.body.name

      const updated =
        await category.save()

      res.json(updated)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// DELETE CATEGORY

export const deleteCategory =
  async (req, res) => {

    try {

      await Category.findByIdAndDelete(
        req.params.id
      )

      res.json({
        message:
          'Category deleted',
      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }