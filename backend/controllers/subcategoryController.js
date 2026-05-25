import Subcategory from '../models/Subcategory.js'


export const createSubcategory =
  async (req, res) => {

    try {

      const subcategory =
        await Subcategory.create({

          name: req.body.name,

          category:
            req.body.category,

        })

      res.status(201).json(
        subcategory
      )

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })
    }
  }


export const getSubcategories =
  async (req, res) => {

    try {

      const subcategories =
        await Subcategory.find()
        .populate('category')

      res.json(subcategories)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })
    }
  }


// GET SUBCATEGORY BY ID

export const getSubcategoryById =
  async (req, res) => {

    try {

      const subcategory =
        await Subcategory.findById(
          req.params.id
        )

      res.json(subcategory)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// UPDATE SUBCATEGORY

export const updateSubcategory =
  async (req, res) => {

    try {

      const subcategory =
        await Subcategory.findById(
          req.params.id
        )

      if (!subcategory) {

        return res.status(404).json({
          message:
            'Subcategory not found',
        })
      }

      subcategory.name =
        req.body.name

      subcategory.category =
        req.body.category

      const updated =
        await subcategory.save()

      res.json(updated)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }


// DELETE SUBCATEGORY

export const deleteSubcategory =
  async (req, res) => {

    try {

      await Subcategory.findByIdAndDelete(
        req.params.id
      )

      res.json({
        message:
          'Subcategory deleted',
      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
  }