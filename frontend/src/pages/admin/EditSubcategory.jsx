import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import API from '../../services/api'

import AdminSidebar
from '../../components/admin/AdminSidebar'

function EditSubcategory() {

  const { id } = useParams()

  const navigate =
    useNavigate()

  const [name, setName] =
    useState('')

  const [category,
    setCategory] =
    useState('')

  const [categories,
    setCategories] =
    useState([])

  const [loading,
    setLoading] =
    useState(false)

  const [error,
    setError] =
    useState('')

  const [success,
    setSuccess] =
    useState('')

  useEffect(() => {

    loadData()

  }, [])

  const loadData =
    async () => {

      try {

        setLoading(true)
        setError('')

        const categoryRes =
          await API.get(
            '/categories'
          )

        setCategories(
          categoryRes.data
        )

        const subRes =
          await API.get(
            `/subcategories/${id}`
          )

        setName(
          subRes.data.name
        )

        setCategory(
          subRes.data.category
        )

      } catch (error) {

        console.log(error)

        setError(
          error.response?.data?.message ||
          'Failed to load subcategory'
        )

      } finally {

        setLoading(false)

      }
    }

  const handleSubmit =
    async (e) => {

      e.preventDefault()

      try {

        setLoading(true)
        setError('')
        setSuccess('')

        await API.put(
          `/subcategories/${id}`,
          {
            name,
            category,
          }
        )

        setSuccess(
          'Subcategory Updated Successfully'
        )

        setTimeout(() => {

          navigate(
            '/admin/manage-subcategories'
          )

        }, 1000)

      } catch (error) {

        console.log(error)

        setError(
          error.response?.data?.message ||
          'Failed to update subcategory'
        )

      } finally {

        setLoading(false)

      }
    }

  return (

    <div className='flex'>

      <AdminSidebar />

      <div className='flex-1 p-10 bg-gray-100 min-h-screen'>

        <div className='bg-white p-8 rounded-3xl shadow-xl max-w-[700px]'>

          <h1 className='text-4xl font-bold mb-8'>
            Edit Subcategory
          </h1>

          {/* SUCCESS MESSAGE */}
          {success && (

            <div className='bg-green-100 text-green-700 p-4 rounded-xl mb-5'>

              {success}

            </div>

          )}

          {/* ERROR MESSAGE */}
          {error && (

            <div className='bg-red-100 text-red-600 p-4 rounded-xl mb-5'>

              {error}

            </div>

          )}

          {/* LOADING */}
          {loading && !name && (

            <div className='text-center text-xl font-semibold py-10'>

              Loading Subcategory...

            </div>

          )}

          <form onSubmit={handleSubmit}>

            <input
              type='text'
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder='Subcategory Name'
              className='w-full border p-4 rounded-xl mb-5'
              required
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className='w-full border p-4 rounded-xl mb-5'
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

            <button
              type='submit'
              disabled={loading}
              className='bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50'
            >

              {loading
                ? 'Updating...'
                : 'Update Subcategory'}

            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default EditSubcategory