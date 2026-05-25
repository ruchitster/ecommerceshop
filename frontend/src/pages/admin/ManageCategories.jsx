import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import API from '../../services/api'

import AdminSidebar
from '../../components/admin/AdminSidebar'

function ManageCategories() {

  const navigate =
    useNavigate()

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

  const fetchCategories =
    async () => {

      try {

        setLoading(true)
        setError('')

        const { data } =
          await API.get(
            '/categories'
          )

        setCategories(data)

      } catch (error) {

        console.log(error)

        setError(
          error.response?.data?.message ||
          'Failed to load categories'
        )

      } finally {

        setLoading(false)

      }
    }

  useEffect(() => {

    fetchCategories()

  }, [])

  const deleteCategory =
    async (id) => {

      const confirmDelete =
        window.confirm(
          'Delete category?'
        )

      if (!confirmDelete)
        return

      try {

        setError('')
        setSuccess('')

        await API.delete(
          `/categories/${id}`
        )

        setSuccess(
          'Category Deleted Successfully'
        )

        fetchCategories()

      } catch (error) {

        console.log(error)

        setError(
          error.response?.data?.message ||
          'Failed to delete category'
        )
      }
    }

  return (

    <div className='flex'>

      <AdminSidebar />

      <div className='flex-1 p-10 bg-gray-100 min-h-screen'>

        <div className='bg-white p-8 rounded-3xl shadow-xl'>

          <h1 className='text-4xl font-bold mb-8'>
            Manage Categories
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
          {loading && (

            <div className='text-center text-xl font-semibold py-10'>

              Loading Categories...

            </div>

          )}

          {/* EMPTY */}
          {!loading && categories.length === 0 && (

            <div className='text-center text-gray-500 text-xl py-10'>

              No Categories Found

            </div>

          )}

          {/* CATEGORY LIST */}
          <div className='space-y-5'>

            {categories.map((cat) => (

              <div
                key={cat._id}
                className='border p-5 rounded-2xl flex items-center justify-between'
              >

                <h2 className='text-2xl font-bold'>
                  {cat.name}
                </h2>

                <div className='flex gap-4'>

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/edit-category/${cat._id}`
                      )
                    }
                    className='bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700'
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteCategory(
                        cat._id
                      )
                    }
                    className='bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700'
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}

export default ManageCategories