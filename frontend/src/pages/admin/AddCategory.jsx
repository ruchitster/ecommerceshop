import { useState } from 'react'

import API from '../../services/api'

import AdminSidebar
from '../../components/admin/AdminSidebar'

function AddCategory() {

  const [name, setName] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)
      setError('')
      setSuccess('')

      await API.post(
        '/categories',
        { name }
      )

      setSuccess(
        'Category Added Successfully'
      )

      setName('')

    } catch (error) {

      console.log(error)

      setError(
        error.response?.data?.message ||
        'Failed to add category'
      )

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className='flex'>

      <AdminSidebar />

      <div className='flex-1 p-10 bg-gray-100 min-h-screen'>

        <div className='bg-white p-8 rounded-3xl shadow max-w-[600px]'>

          <h1 className='text-4xl font-bold mb-8'>
            Add Category
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

          <form onSubmit={handleSubmit}>

            <input
              type='text'
              placeholder='Category Name'
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className='w-full border p-4 rounded-xl mb-5'
              required
            />

            <button
              type='submit'
              disabled={loading}
              className='bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50'
            >

              {loading
                ? 'Adding...'
                : 'Add Category'}

            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default AddCategory