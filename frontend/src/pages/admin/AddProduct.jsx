import {
  useEffect,
  useState,
} from 'react'

import API from '../../services/api'

import AdminSidebar
from '../../components/admin/AdminSidebar'

function AddProduct() {

  const [categories,
    setCategories] = useState([])

  const [subcategories,
    setSubcategories] = useState([])

  const [filteredSubs,
    setFilteredSubs] = useState([])

  const [formData,
    setFormData] = useState({

      name: '',
      description: '',
      category: '',
      subcategory: '',

    })

  const [variants,
    setVariants] =
    useState([
      {
        size: '',
        color: '',
        price: '',
        stock: '',
      }
    ])

  const [image,
    setImage] = useState(null)

  const [loading,
    setLoading] = useState(false)

  const [error,
    setError] = useState('')

  const [success,
    setSuccess] = useState('')

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {

    fetchCategories()

    fetchSubcategories()

  }, [])

  const fetchCategories =
    async () => {

      try {

        const { data } =
          await API.get('/categories')

        setCategories(data)

      } catch (error) {

        console.log(error)
      }
    }

  const fetchSubcategories =
    async () => {

      try {

        const { data } =
          await API.get('/subcategories')

        setSubcategories(data)

      } catch (error) {

        console.log(error)
      }
    }

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,

      })

      // CATEGORY FILTER
      if (
        e.target.name ===
        'category'
      ) {

        const filtered =
          subcategories.filter(

            (sub) =>

              sub.category?._id ===
              e.target.value

          )

        setFilteredSubs(filtered)
      }
    }

  // =========================
  // VARIANT CHANGE
  // =========================
  const handleVariantChange =
    (
      index,
      field,
      value
    ) => {

      const updated =
        [...variants]

      updated[index][field] =
        value

      setVariants(updated)
    }

  // =========================
  // ADD VARIANT
  // =========================
  const addVariant = () => {

    setVariants([

      ...variants,

      {
        size: '',
        color: '',
        price: '',
        stock: '',
      }

    ])
  }

  // =========================
  // REMOVE VARIANT
  // =========================
  const removeVariant =
    (index) => {

      const updated =
        variants.filter(
          (_, i) =>
            i !== index
        )

      setVariants(updated)
    }

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit =
    async (e) => {

      e.preventDefault()

      try {

        setLoading(true)

        setError('')
        setSuccess('')

        const data =
          new FormData()

        Object.keys(formData)
          .forEach((key) => {

            data.append(
              key,
              formData[key]
            )

          })

        data.append(
          'variants',
          JSON.stringify(
            variants
          )
        )

        if (image) {

          data.append(
            'image',
            image
          )
        }

        await API.post(
          '/products',
          data
        )

        setSuccess(
          'Product Added Successfully'
        )

        // RESET FORM
        setFormData({

          name: '',
          description: '',
          category: '',
          subcategory: '',

        })

        setVariants([
          {
            size: '',
            color: '',
            price: '',
            stock: '',
          }
        ])

        setFilteredSubs([])

        setImage(null)

      } catch (error) {

        console.log(error)

        setError(

          error.response?.data?.message ||

          error.message ||

          'Failed to add product'

        )

      } finally {

        setLoading(false)
      }
    }

  return (

    <div className='flex'>

      <AdminSidebar />

      <div className='flex-1 p-10 bg-gray-100 min-h-screen'>

        <div className='bg-white p-8 rounded-3xl shadow-xl max-w-[1000px]'>

          <h1 className='text-4xl font-bold mb-8'>
            Add Product
          </h1>

          {/* SUCCESS MESSAGE */}
          {success && (

            <div className='bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl mb-5'>

              {success}

            </div>

          )}

          {/* ERROR MESSAGE */}
          {error && (

            <div className='bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-5'>

              {error}

            </div>

          )}

          <form onSubmit={handleSubmit}>

            {/* PRODUCT NAME */}
            <input
              type='text'
              name='name'
              placeholder='Product Name'
              value={formData.name}
              className='w-full border p-4 rounded-xl mb-5'
              onChange={handleChange}
              required
            />

            {/* DESCRIPTION */}
            <textarea
              name='description'
              placeholder='Description'
              rows='5'
              value={formData.description}
              className='w-full border p-4 rounded-xl mb-5'
              onChange={handleChange}
              required
            ></textarea>

            {/* VARIANTS */}

            <div className='mb-8'>

              <h2 className='text-2xl font-semibold mb-5'>
                Product Variants
              </h2>

              {
                variants.map(
                  (
                    variant,
                    index
                  ) => (

                    <div
                      key={index}
                      className='grid md:grid-cols-5 gap-4 mb-4'
                    >

                      <input
                        type='text'
                        placeholder='Size'
                        className='border p-4 rounded-xl'
                        value={variant.size}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            'size',
                            e.target.value
                          )
                        }
                        required
                      />

                      <input
                        type='text'
                        placeholder='Color'
                        className='border p-4 rounded-xl'
                        value={variant.color}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            'color',
                            e.target.value
                          )
                        }
                        required
                      />

                      <input
                        type='number'
                        placeholder='Price'
                        className='border p-4 rounded-xl'
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            'price',
                            e.target.value
                          )
                        }
                        required
                      />

                      <input
                        type='number'
                        placeholder='Stock'
                        className='border p-4 rounded-xl'
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            'stock',
                            e.target.value
                          )
                        }
                        required
                      />

                      <button
                        type='button'
                        onClick={() =>
                          removeVariant(index)
                        }
                        className='bg-red-500 text-white px-4 py-2 rounded-xl'
                      >
                        Remove
                      </button>

                    </div>

                  )
                )
              }

              <button
                type='button'
                onClick={addVariant}
                className='bg-blue-500 text-white px-6 py-3 rounded-xl'
              >
                Add Variant
              </button>

            </div>

            {/* CATEGORY + SUBCATEGORY */}

            <div className='grid md:grid-cols-2 gap-5 mt-5'>

              <select
                name='category'
                value={formData.category}
                className='border p-4 rounded-xl'
                onChange={handleChange}
                required
              >

                <option value=''>
                  Select Category
                </option>

                {categories.map((cat) => (

                  <option
                    key={cat._id}
                    value={cat._id}
                  >
                    {cat.name}
                  </option>

                ))}

              </select>

              <select
                name='subcategory'
                value={formData.subcategory}
                className='border p-4 rounded-xl'
                onChange={handleChange}
                required
              >

                <option value=''>
                  Select Subcategory
                </option>

                {filteredSubs.map((sub) => (

                  <option
                    key={sub._id}
                    value={sub._id}
                  >
                    {sub.name}
                  </option>

                ))}

              </select>

            </div>

            {/* IMAGE */}

            <input
              type='file'
              className='mt-5'
              onChange={(e) =>
                setImage(
                  e.target.files[0]
                )
              }
              required
            />

            {/* SUBMIT */}

            <button
              type='submit'
              disabled={loading}
              className='bg-black text-white px-8 py-4 rounded-xl mt-8 hover:bg-gray-800'
            >
              {loading
                ? 'Adding Product...'
                : 'Add Product'}
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default AddProduct