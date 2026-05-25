import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../../services/api'
import AdminSidebar from '../../components/admin/AdminSidebar'

function EditProduct() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [filteredSubs, setFilteredSubs] = useState([])

  const [preview, setPreview] = useState('')
  const [image, setImage] = useState(null)

  const [variants, setVariants] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      const [catRes, subRes, productRes] = await Promise.all([
        API.get('/categories'),
        API.get('/subcategories'),
        API.get(`/products/${id}`)
      ])

      setCategories(catRes.data)
      setSubcategories(subRes.data)

      const product = productRes.data

      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        subcategory: product.subcategory,
      })

      setVariants(product.variants || [])

setPreview(`${import.meta.env.VITE_API_UPLOADS_URL}/${product.image}`)

      const filtered = subRes.data.filter(
        (sub) => sub.category._id === product.category
      )

      setFilteredSubs(filtered)

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === 'category') {
      const filtered = subcategories.filter(
        (sub) => sub.category._id === value
      )

      setFilteredSubs(filtered)

      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategory: '',
      }))
    }
  }

  // =========================
  // VARIANTS
  // =========================
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants]
    updated[index][field] = value
    setVariants(updated)
  }

  const addVariant = () => {
    setVariants([
      ...variants,
      { size: '', color: '', price: '', stock: '' }
    ])
  }

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const data = new FormData()

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key])
      })

      data.append('variants', JSON.stringify(variants))

      if (image) {
        data.append('image', image)
      }

      await API.put(`/products/${id}`, data)

      setSuccess('Product updated successfully')

      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 1000)

    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex">

      <AdminSidebar />

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">

        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-[1000px]">

          <h1 className="text-4xl font-bold mb-6">
            Edit Product
          </h1>

          {/* SUCCESS */}
          {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-4">
              {success}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-600 p-4 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <p className="mb-4 font-semibold">Loading...</p>
          )}

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-4 rounded-xl mb-4"
              placeholder="Product Name"
              required
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-4 rounded-xl mb-4"
              placeholder="Description"
              rows="4"
              required
            />

            {/* VARIANTS */}
            <div className="mb-6">

              <h2 className="text-xl font-bold mb-3">
                Variants
              </h2>

              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-4 gap-3 mb-3">

                  <input
                    placeholder="Size"
                    value={v.size}
                    onChange={(e) =>
                      handleVariantChange(i, 'size', e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                  <input
                    placeholder="Color"
                    value={v.color}
                    onChange={(e) =>
                      handleVariantChange(i, 'color', e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                  <input
                    placeholder="Price"
                    value={v.price}
                    onChange={(e) =>
                      handleVariantChange(i, 'price', e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                  <input
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) =>
                      handleVariantChange(i, 'stock', e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                </div>
              ))}

              <button
                type="button"
                onClick={addVariant}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Variant
              </button>

            </div>

            {/* CATEGORY */}
            <div className="grid grid-cols-2 gap-4 mb-4">

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border p-3 rounded"
              >
                <option value="">Select Category</option>

                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}

              </select>

              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="border p-3 rounded"
              >
                <option value="">Select Subcategory</option>

                {filteredSubs.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}

              </select>

            </div>

            {/* IMAGE */}
            {preview && (
              <img
                src={preview}
                className="w-32 h-32 object-cover rounded mb-3"
              />
            )}

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="mb-4"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl"
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default EditProduct