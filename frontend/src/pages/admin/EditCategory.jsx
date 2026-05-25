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

function EditCategory() {

  const { id } = useParams()

  const navigate =
    useNavigate()

  const [name, setName] =
    useState('')

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

    fetchCategory()

  }, [])

  const fetchCategory =
    async () => {

      try {

        setLoading(true)
        setError('')

        const { data } =
          await API.get(
            `/categories/${id}`
          )

        setName(data.name)

      } catch (error) {

        console.log(error)

        setError(
          error.response?.data?.message ||
          'Failed to load category'
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
          `/categories/${id}`,
          { name }
        )

        setSuccess(
          'Category Updated Successfully'
        )

        setTimeout(() => {

          navigate(
            '/admin/manage-categories'
          )

        }, 1000)

      } catch (error) {

        console.log(error)

        setError(
          error.response?.data?.message ||
          'Failed to update category'
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
            Edit Category
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

              Loading Category...

            </div>

          )}

          <form onSubmit={handleSubmit}>

            <input
              type='text'
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder='Category Name'
              className='w-full border p-4 rounded-xl mb-5'
              required
            />

            <button
              type='submit'
              disabled={loading}
              className='bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50'
            >

              {loading
                ? 'Updating...'
                : 'Update Category'}

            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default EditCategory